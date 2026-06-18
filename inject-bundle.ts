/**
 * inject-bundle.ts — notlob ~on-build hook for pn-pacman.
 *
 * Reads the JSON manifest supplied by notlob, bundles the main.ts
 * artifact with esbuild, and injects the result as an inline <script>
 * into index.html, replacing the <!-- NOTLOB_BUNDLE --> placeholder.
 *
 * Usage (called automatically by `notlob build`):
 *   tsx inject-bundle.ts <manifest-path>
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

  if (!mainArtifact) {
    console.error('inject-bundle: cannot locate main artifact in manifest');
    console.error(JSON.stringify(manifest, null, 2));
    process.exit(1);
    return;
  }

  console.log(`inject-bundle: bundling ${path.relative(projectRoot, mainArtifact)}`);

  // Bundle with esbuild — iife format so it runs immediately in the browser.
  const result = await build({
    entryPoints: [mainArtifact],
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

  const html     = fs.readFileSync(htmlPath, 'utf8');
  const injected = html.replace(
    '<!-- NOTLOB_BUNDLE -->',
    `<script>\n${bundledJs}\n</script>`,
  );

  const outHtml = path.join(outputDir, 'index.html');
  fs.writeFileSync(outHtml, injected, 'utf8');
  console.log(`inject-bundle: wrote ${path.relative(projectRoot, outHtml)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
