# Contributing

This repository is generated from Wisty UI's private source. Each `Sync from source <sha>` commit replaces every file, so nothing is merged here.

Issues and pull requests are welcome. If we take a pull request, we port the change to the source by hand, and it arrives with the next sync.

Before you open one:

- Keep shadcn's API. A primitive in `registry/ui/` keeps shadcn's file names, exports, props, variant names and `data-slot` values; only its classes change.
- Change the Radix file in `registry/ui/`. Files marked GENERATED, like the Base UI copies in `registry/base/ui/` and the theme files, are rebuilt in the source, so describe a change to one in your pull request instead.
- Take colors, radii, shadows and font sizes from the tokens in `registry/themes/`, never literal values.
- Say which themes you checked: Cosmos, Cosmos dark, Lightning Blue, Neutral and Neutral dark.

A contribution is licensed like the files it changes: see `LICENSE` and `THIRD_PARTY_NOTICES.md`.
