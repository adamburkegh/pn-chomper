# Changelog

## Unreleased

### Fixed

- The `inject-bundle.ts` build hook now copes with being run by another
  project's build: a build that has no main module is skipped with a message
  and exit 0 instead of failing the hook, and `docs/index.html` is only
  refreshed by the project's own build into `dist/`, not by a build sent
  elsewhere with `--output`.
- A chomper eaten by a ghost on the last dot no longer triggers
  "YOU WIN". Collision resolution now runs before dot collection in
  `playerMove`, so a chomper eaten by a ghost does not get to collect the
  dot it stepped on. Thanks to Felix Pham for the bug report.

### Development

- `game/engine.lob`: test-only helper functions moved from the body to
  `#Appendix Test Helpers`, keeping the module narrative clear of
  test scaffolding.
- Property-based test (`~property`) added to `##Player Move` verifying the
  collision-beats-win invariant across maps and fork arms using fast-check.

## 0.8.0 - 2026-10-03

- **Mandala map**: a new built-in map that teaches splitting as a cascade.
  One token forks into two, each of those forks again into four, and the four
  reconverge through two synchronising joins and a final join. Every corridor
  has an escape route home through a central Mid room, and the ghost starts at
  the far end of a long one-way tail so it takes five turns to reach the fork
  machinery.
- **Deadlock costs a life**: a marking where tokens remain but nothing can fire
  now loses a life and resets, with a "Deadlock ..." message, instead of
  leaving the game stuck. A collision shows "Life lost ...", and the spot
  flashes when a ghost catches a chomper. This also makes Diamond winnable.
- **Corridors are easier to read**:
  - Return arcs, such as restart, are dashed rather than drawn as corridors,
    including the arc into the restart doorway.
  - Corridors that cross get a bridge, so one visibly passes over the other.
  - Hovering a doorway highlights its corridors in gold and dims the rest.
  - Corridors on every doorway you can fire now are tinted a muted gold, so
    touch screens get the same cue without hover.
  - A new, brighter palette: corridor edges, place outlines, doorway borders
    and labels all sit at roughly 4:1 contrast against the background, where
    the old near-black corridors were barely visible. The menu, hint and
    version text are lighter too.
- **A second plane for escapes**: Circuit and Mandala draw their escape
  rooms, restart and the ghost tail as dashed curves that sweep round the
  outside, so the solid corridors no longer cross. Mandala is also redrawn as
  two diamonds with a centre line, which makes it much easier to follow.
- **Place and doorway names hidden on built-in maps**: they are for debugging
  a map, not for playing it. Press L, or use the menu, to show them. Maps
  loaded from a PNML file or `?map=` show them by default, since an imported
  net's names carry its meaning.
- **Startup hint moved to the top edge** so it no longer covers the middle of
  the map, and now begins with a capital letter.

### Development

- New seeded playtest simulation (`sim/playtest.lob`) with random and greedy
  player policies, run over many seeds to measure how winnable a map is. It
  also reports how tangled each map's drawing is.
- New `render/layout.lob` module counts arc crossings, and claims now hold
  Circuit and Mandala at zero crossings among solid corridors.
- `petri/net.lob` gains structural detection of feedback and return arcs.

## 0.7.1 - Multi-token start support

- **Multiple chomper start places**: maps can now designate more than one
  player start — each start place receives one chomper token at game
  initialisation. Tokens reset to all start places on a life loss.
- **PNML `initialMarking` respected**: when loading a PNML file, the
  `initialMarking` count at each start place is honoured. A place marked
  with `<initialMarking><text>10</text></initialMarking>` starts with 10
  chomper tokens, not one.
- **Token count on chomper icon**: when multiple chomper tokens occupy a
  single place, the count is displayed on the chomper body. Single-token
  places are unchanged.

## 0.7.0 — Initial release

First public release of PN Chomper, a browser puzzle game where the map is a Petri net: tokens are chompers, transitions are doorways, places are rooms, and arcs are corridors.

### Highlights

- **Core gameplay**: click an enabled transition to fire it and move your chomper through the maze, eating dots and avoiding ghosts.
- **Petri net semantics as game mechanics**: transitions with multiple output arcs split your token into two chompers; transitions with multiple input arcs require chompers to converge before firing.
- **Ghost AI**: autonomous tokens that fire enabled transitions at random, spawned from designated transitions.
- **Built-in maps**: Figure-eight, Split (Y-junction), Diamond (sync + detours), and Circuit (fork + join).
- **PNML import/export**: load any standard PNML file as a map, or export the current map to PNML. Game-specific data (player start, ghost spawns, dots, node radius) is carried in `toolspecific` extensions, so vanilla PNML readers can still open exported maps.
- **Shareable maps**: load an external PNML file at startup via `?map=<url>`, or load one locally from the menu.
- **Self-contained build**: a single static `index.html`, no server required. A copy is committed to `docs/` for easy distribution straight from GitHub.
- **Mobile-friendly menu**: menu accessible via ESC or a tap on the ☰ button, for touch devices.

### Documentation

- README includes gameplay instructions, map-authoring guide (ghosts, chomper start, dot suppression), and map-sharing instructions.
- Literate source (`overview.lob` and friends) documents the design rationale: the game as both casual fun and a Petri net teaching tool.
