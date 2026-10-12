# pn-chomper

PN Chomper is a browser puzzle game where you eat dots, go through open doorways, and run away from ghosts. [Try it here](https://adamburkeware.net/games/pn-chomper/latest/).

The map is a Petri net and the player controls the token. It's intended as casual fun and a learning aid for students. 


# Maps

Any PNML file can be loaded as a map. To make it a chomper-style puzzle, you will need to edit the PNML source to add ghosts, and specify a chomper start point if there is no initial marking.

## Ghosts

A ghost starts on any place carrying a tool-specific `<ghostStart/>` block, just as the chomper starts on a place. Mark several places for several ghosts, or put a count in the element to start several ghosts on one place: `<ghostStart>3</ghostStart>`.

```xml
<place id="p_den">
  <name><text>Den</text></name>
  <toolspecific tool="pn-chomper" version="1.0">
    <ghostStart/>
  </toolspecific>
</place>
```

Earlier versions marked a transition with `<ghostSpawn/>` instead. That form is no longer read.

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

# Credits

This project used a copy-paste fork of the [YAPNE project](https://github.com/chimenkamp/YAPNE-Yet-Another-Petri-Net-Editor) for the starting data structures and visualisation.
