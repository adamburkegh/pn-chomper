# pn-chomper

PN Chomper is a browser puzzle game where you eat dots, go through open doorways, and run away from ghosts. [Try it here](https://adamburkeware.net/games/pn-chomper/latest/).

The map is a Petri net and the player controls the token. It's intended as casual fun and a learning aid for students. 


# Maps

Any PNML file can be loaded as a map. To make it a chomper-style puzzle, you will need to edit the PNML source to add ghosts, and specify a chomper start point if there is no initial marking.

## Tokens

A map has three kinds of token, each a count on a place: the chompers, the ghosts and the dots. In PNML each is written as a count on the place that holds it.

## Chomper Start

The chomper is the net's own initial marking. Mark exactly one place with `<playerStart/>`, or give multiple places `<initialMarking><text>n</text></initialMarking>` where n is the exact number of tokens in that place.

## Ghosts

A ghost starts on any place with a `tokens` element for the colour `ghost` in its tool-specific block. A bare element is one ghost, and a number is that many.

```xml
<place id="p_den">
  <name><text>Den</text></name>
  <toolspecific tool="pn-chomper" version="1.0">
    <tokens colour="ghost">1</tokens>
  </toolspecific>
</place>
```

## Dots

By default, each place has one dot. A `tokens` element for the colour `dot` changes that: `0` removes the dot and `3` puts three dots there. Eating a place's dots scores ten for each.

```xml
<tokens colour="dot">0</tokens>
```

## Declaring colours

Normally nothing needs declaring. The three colours have built-in defaults: the dot has a default of one per place and is kept when a life is lost, and the chomper and the ghost have a default of none and are put back at their start. A map that wants something different says so once, in the net's tool-specific block:

```xml
<toolspecific tool="pn-chomper" version="1.0">
  <colours>
    <colour name="chomper" marking="initial"/>
    <colour name="ghost"/>
    <colour name="dot" default="0" reset="restore"/>
  </colours>
</toolspecific>
```

`default` is the count on every place that has no `tokens` element for the colour. `reset` is `keep` to leave the colour alone when a life is lost, or `restore` to deal it again from the start. An attribute left out means the built-in value. A colour the game has no rules for is reported in the browser console and ignored.

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
