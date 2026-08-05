# Changelog

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
