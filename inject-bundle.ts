/**
 * inject-bundle.ts — notlob ~on-build hook for pn-chomper.
 *
 * Reads the JSON manifest supplied by notlob, bundles the main.ts
 * artifact with esbuild, and injects the result as an inline <script>
 * into index.html, replacing the <!-- NOTLOB_BUNDLE --> placeholder.
 *
 * Usage (called automatically by `notlob build`):
 *   tsx inject-bundle.ts <manifest-path>
 *
 * It is meant for a build of the whole project. A build that does not
 * include the main artifact is skipped with exit 0, and docs/index.html is
 * only refreshed when the output directory is the project's own dist/.
 */

import * as fs from 'fs';
import * as path from 'path';
import { build } from 'esbuild';

async function main(): Promise<void> {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    console.error('inject-bundle: expected manifest path as first argument');
    process.exit(1);
  }

  const manifest     = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const projectRoot: string = manifest.project_root;
  const outputDir: string   = manifest.output_dir;
  const artifacts: string[] = manifest.artifacts;

  // Find the main entry — the artifact whose source module has a ~run claim.
  const entryPoints: string[] = manifest.entry_points ?? [];
  const mainArtifact =
    entryPoints.find((p: string) => path.basename(p).includes('main')) ??
    artifacts.find((p: string) => path.basename(p).includes('main'));

  // A build of some other module (a single-file build asked for by a
  // caller, say) has no game to bundle. That is not a failure, so say so
  // and stop quietly instead of failing the hook.
  if (!mainArtifact) {
    console.log('inject-bundle: no main artifact in this build, nothing to bundle');
    return;
  }

  console.log(`inject-bundle: bundling ${path.relative(projectRoot, mainArtifact)}`);

  // notlob compiles every ~run claim with a Node "is this the directly
  // executed main module" guard — `import.meta.url === pathToFileURL(...)`.
  // That's correct for `notlob run <file>` but meaningless (and fatal —
  // `require("node:url")` doesn't exist) in a browser bundle, where the
  // ~run block must simply execute unconditionally on load. Strip it here
  // rather than in notlob itself, since this browser-bundling concern is
  // specific to this project's build hook.
  let mainSource = fs.readFileSync(mainArtifact, 'utf8');
  mainSource = mainSource
    .replace(/^import\s*\{\s*pathToFileURL\s*\}\s*from\s*['"]node:url['"];\s*\n/m, '')
    .replace(
      /if\s*\(\s*import\.meta\.url\s*===\s*pathToFileURL\(process\.argv\[1\]\)\.href\s*\)\s*\{/,
      '{',
    );
  if (mainSource === fs.readFileSync(mainArtifact, 'utf8')) {
    console.warn('inject-bundle: expected Node run-guard not found — notlob codegen may have changed');
  }

  // Bundle with esbuild — iife format so it runs immediately in the browser.
  const result = await build({
    stdin: {
      contents: mainSource,
      resolveDir: path.dirname(mainArtifact),
      sourcefile: path.basename(mainArtifact),
      loader: 'ts',
    },
    bundle: false,    // all code is already inlined by notlob build
    format: 'iife',
    target: 'es2020',
    minify: false,
    write: false,     // capture output in memory
  });

  const bundledJs = result.outputFiles[0].text;

  // Find HTML template among externals, or fall back to project root.
  const externals: string[] = manifest.externals ?? [];
  const htmlPath =
    externals.find((p: string) => /\.(html|html\.tmpl)$/.test(p)) ??
    path.join(projectRoot, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.error(`inject-bundle: index.html not found at ${htmlPath}`);
    process.exit(1);
    return;
  }

  const pkgPath = path.join(projectRoot, 'package.json');
  const version = fs.existsSync(pkgPath)
    ? (JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version ?? '')
    : '';

  const html     = fs.readFileSync(htmlPath, 'utf8');
  const injected = html
    .replace('<!-- NOTLOB_VERSION -->', `v${version}`)
    .replace('<!-- NOTLOB_BUNDLE -->', `<script>\n${bundledJs}\n</script>`);

  const outHtml = path.join(outputDir, 'index.html');
  fs.writeFileSync(outHtml, injected, 'utf8');
  console.log(`inject-bundle: wrote ${path.relative(projectRoot, outHtml)}`);

  // docs/index.html is the committed distribution copy, so only the
  // project's own build into dist/ may refresh it. A build sent somewhere
  // else with --output must not rewrite a tracked file.
  const isProjectBuild =
    path.resolve(outputDir) === path.resolve(projectRoot, 'dist');
  if (isProjectBuild) {
    const docsDir  = path.join(projectRoot, 'docs');
    const docsHtml = path.join(docsDir, 'index.html');
    fs.mkdirSync(docsDir, { recursive: true });
    fs.copyFileSync(outHtml, docsHtml);
    console.log(`inject-bundle: copied to ${path.relative(projectRoot, docsHtml)}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
