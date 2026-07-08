# pn-chomper

PN Chomper is a browser puzzle game where you eat dots, go through open doorways, and run away from ghosts. [Try it here](https://adamburkegh.github.io/pn-chomper).

The map is a Petri net and the player controls the token. It's intended as casual fun and a learning aid for students. 

Petri nets in PNML can be loaded as maps, which will be populated with one dot per place. Maps can be shared as a link using the `?map=` query parameter, eg `https://<host>/index.html?map=https://example.com/mynet.pnml`.


# Development

## Design and Implementation

Built in [notlob](https://github.com/adamburkegh/notlob) literate TypeScript. Start reading at [overview.lob](overview.lob).


## Build

```
.venv/Scripts/notlob build
```

Output: `dist/index.html` — open in any browser, no server needed.



