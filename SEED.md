# Seed agent instructions

High level detail on the project is in `README.md`. 

## Design

Look in `ref-projects/YAPNE` for a mature Petri net editor that can be reused in copy-fork paste mode for this purpose. 

Favour lightweight solutions with few dependencies. The game is mainly to run in a browser and be played for 10-20 minutes for fun, and to support teaching.

## Agent instructions

### Project setup

Notlob is a python application. Start by installing notlob from local path `~/bpm/notlob-lab`. Then initialise the project with

```
notlob init --language typescript
npm init -y
npm install --save-dev tsx esbuild @types/node
```

After running the install, there are further instructions on using notlob in `USER-AGENTS.md`.

### Planning and Design

Create an overview.lob as the description of the overall design and future plans. Evolve sections of this into implementations organised around one central concept per file. Each `.lob` file should include clear descriptions, evolving running code, property and unit tests.

