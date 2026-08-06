# pn-chomper

PN Chomper is a browser puzzle game where you eat dots, go through open doorways, and run away from ghosts. [Try it here](https://adamburkeware.net/games/pn-chomper/latest/).

The map is a Petri net and the player controls the token. It's intended as casual fun and a learning aid for students. 


# Maps

Any PNML file can be loaded as a map. To make it a chomper-style puzzle, you will need to edit the PNML source to add ghosts, and specify a chomper start point if there is no initial marking.

## Ghosts

Ghost spawn points are determined by a tool-specific block added to a transition. Multiple transitions can be made ghost spawns.

```xml
<transition id="t_fork">
  <name><text>Fork</text></name>
  <toolspecific tool="pn-chomper" version="1.0">
    <ghostSpawn/>
  </toolspecific>
</transition>
```

## Chomper Start

Mark exactly one place with `<playerStart/>` or multiple places with `<initialMarking><text>n</text></initialMarking>` where n is the exact number of tokens in that place.

## Suppressing Dots

By default, each place has a dot. This can be suppressed with `<hasDot>false</hasDot>`.

## Sharing Maps

A specific map in the game can be shared with the URL:

```
https://<pn-chomper-url>/?map=https://example.com/mymap.pnml
```



# Development

## Design and Implementation

Built in [notlob](https://github.com/adamburkegh/notlob) literate TypeScript. Start reading at [overview.lob](overview.lob).


## Build

Requires [notlob](https://github.com/adamburkegh/notlob) installed as a global CLI tool (e.g. via `pipx install notlob`).

```
notlob build
```

Output: `dist/index.html` — open in any browser, no server needed. 

A copy is also placed in `docs/` for easy distribution from github.

## Host

The file `index.html` can be hosted as a self-contained static file.
