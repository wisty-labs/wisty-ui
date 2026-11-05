---
name: wisty-ui
description: Find, install and compose Wisty UI, the shadcn registry that gives React apps Salesforce Lightning's look (SLDS 2) on Radix or Base UI. Use when the user mentions Wisty UI or @wisty, when components.json lists the @wisty registry, or when they want a React screen that looks like Salesforce Lightning or SLDS, such as a lookup, a record page or record header, a list view, a data table of records, a path or Lightning-style charts, in a shadcn project. Do not use for ordinary shadcn/ui work with no Salesforce look, or for Salesforce backend work like Apex, SOQL, Lightning Web Components or metadata deployment.
---

# Wisty UI

Wisty UI is a shadcn registry. It restyles shadcn/ui with Salesforce Lightning Design System 2 and adds what shadcn lacks, like a lookup, a data table, a record header and charts, plus blocks that do one Salesforce job each. Every item ships for Radix and for Base UI, and the shadcn CLI installs it. It is not an npm package, so never `npm install` it.

Everything lives at `https://ui.wisty.ai`. Each item's docs are Markdown at `https://ui.wisty.ai/<name>.md`, for Radix projects, and at `https://ui.wisty.ai/<name>.md?base=base` for Base UI projects. Read an item's Markdown before writing code with it.

## Inspect the project

Read the project before you choose anything.

1. Open `components.json`. Without one, this isn't a shadcn project yet: run `npx shadcn@latest init` first, or ask the user.
2. Read `style`. It picks the library, and every file and example you use must match it:
   - `radix-*`, `new-york` or `default`: Radix. Components take `asChild`.
   - `base-*`: Base UI. Components take `render`.
   - Anything else is a style Wisty UI doesn't serve. React Aria isn't supported.
3. Run the CLI as `npx shadcn@latest`. `@wisty` is listed in shadcn's registry directory, so the CLI finds it and adds it to `registries` in `components.json` on the first install; there's nothing to add by hand. Only if the project pins shadcn 3 or older, add it yourself:

   ```json
   {
   	"registries": {
   		"@wisty": "https://ui.wisty.ai/r/{style}/{name}.json"
   	}
   }
   ```

   Leave `{style}` as written. The CLI fills it in, so a Radix project gets Radix files and a Base UI project gets Base UI files.

4. Find the Tailwind stylesheet: `tailwind.css` in `components.json`, the file that has `@import "tailwindcss"`. Check whether it already has Wisty UI's theme: `--color-page` in its `@theme inline`, or an import of `styles/wisty/tokens.css`. Salesforce's React template names `styles/global.css` in `components.json`, but its stylesheet is `src/styles/global.css`.
5. Note what's already in `components/ui/` and `components/wisty/`. An installed file may have local edits. Don't overwrite it without asking.

## Find and choose

Use the best tool you have, in this order. Never invent an item name, a prop or a part. If nothing matches, say so and build from items that exist.

**With Wisty UI's MCP server** (tools named `search_components`, `get_component`, `get_example`, `get_install_command`):

1. `search_components` with one to three words for the job, like "record picker" or "confirm delete".
2. `get_component` for each candidate, with the project's `style`. It returns the examples by name, When to use, When not to use, Usage, Rules and the API for that library, then the longer docs sections. For an item you already know, pass `sections`, like `["Rules"]` or `["API reference"]`, to read only those.
3. `get_example` for the example closest to what you're building.
4. `get_install_command` with the `style` and the Tailwind stylesheet's path, and `themed: true` if the stylesheet already has the theme. It returns the theme step unless you passed `themed`, the command, and, when the install brings Icon, the step that copies Salesforce's icon sprites to `public/assets/icons`.

**With shadcn's MCP server**: search the `@wisty` registry, then fetch the item's Markdown (`https://ui.wisty.ai/<name>.md`, plus `?base=base` on Base UI). shadcn's search returns one line per item, which isn't enough to choose by.

**With neither**: read `https://ui.wisty.ai/llms.txt`, which lists every item with its description and its Markdown link. To search, fetch `https://ui.wisty.ai/r/<style>/registry.json?q=<words>` with the project's style. Then fetch the Markdown of each candidate.

To choose between candidates, read **When to use** and **When not to use** on each. When two items fit, When not to use decides, and it often names the right one ("For a list of records, use List view header above a Data table"). The description says what an item needs, like "Needs Entitlement Management". If the user's org may not have that, ask.

Prefer the biggest item that does the job. A block that already arranges a record header, its fields and its actions beats rebuilding it from primitives.

## Install

```bash
npx shadcn@latest add @wisty/<name>
```

Use the project's package runner (`pnpm dlx`, `bunx`, `yarn dlx`) if it doesn't use npm. Several items go in one command.

The CLI installs the item's npm packages and the other items it needs. Primitives land in `components/ui/`, like shadcn's own. Components, blocks, templates and helpers land in `components/wisty/`. Import them by those paths: `@/components/ui/button`, `@/components/wisty/lookup`.

If the stylesheet doesn't have the theme yet, add it once:

```bash
npx shadcn@latest add @wisty/cosmos
```

It writes Cosmos into the `:root` and `.dark` rules of the stylesheet `components.json` names as `tailwind.css`. Installing components never changes the stylesheet, so later installs need nothing more. Cosmos is the default theme. For Lightning Blue or Neutral, add `@wisty/lightning-blue` or `@wisty/neutral` instead. Each replaces the theme before it.

In Salesforce's React template the theme step stops with `ENOENT`, because `components.json` names a stylesheet that isn't there. Ask before changing the template's `components.json`. Otherwise add the theme by hand: every install copies it to `src/styles/wisty/`, so add `@import "./wisty/tokens.css";` and `@import "./wisty/cosmos.css";` after the Tailwind import in `src/styles/global.css`, and remove that file's own `:root` and `.dark` rules, which would win over the imported theme.

## Compose

Wisty UI has five kinds of item. Knowing which one you have tells you how to use it.

- **Primitive**: shadcn's own component, restyled, like Button, Select or Dialog. Its file name, exports, props, variant names and `data-slot` values are shadcn's, so shadcn code works unchanged.
- **Component**: something shadcn lacks, like Lookup, Data table or Gauge, built in shadcn's shape: parts you arrange, `className` on each, variants. It knows the general idea it draws, never a Salesforce product's rules.
- **Block**: an assembly that does one Salesforce job, like a record header or a forecast card. Install it, then edit it. It takes its records as props, and its `<name>-data.ts` file holds sample data in the shape it reads. Pass the app's real records in that shape, and keep fetching in the app.
- **Template**: a page of blocks. Its root is a `div`, since it sits inside the app's own `<main>`.
- **Helper**: a function a block calls to turn records into props. It comes with the block that needs it.

Follow these when you write the screen:

- **Use the item's API as its docs give it.** On Radix, primitives compose with `asChild`. On Base UI, with `render`. Use the API reference and the examples for the project's library, and don't copy a Radix example into a Base UI project.
- **Style a link as a button** with `buttonVariants()` from `@/components/ui/button` in its `className`.
- **Keep the theme's tokens.** Use the classes shadcn uses, like `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border` and `bg-primary`. Never a literal color, radius or shadow: each theme sets its own, and a literal breaks the others.
- **Change a look by overriding a token**, like `--primary` on `:root`, never by editing class strings across files.
- **Put the theme on `<html>`.** The `dark` class for dark mode, and `data-density="compact"` for compact density. With the theme files imported by hand, also `data-theme="cosmos"`, `"lightning-blue"` or `"neutral"`. Popovers, selects and dialogs render into `document.body`, so a theme on a smaller element doesn't reach them. Lightning Blue has no dark mode.
- **Salesforce's icons come from `@salesforce-ux/icons`, unaltered.** Installing an item that draws them installs the package. Once per project, copy its `dist/salesforce-lightning-design-system-icons` folder to `public/assets/icons` as it is, `License-for-icons.txt` included. If the app serves them from another path, wrap it in an `IconProvider` with that `basePath`, which points at sprites already served and copies nothing. Never copy, redraw or edit the artwork, and credit it as Icon's Rules say. Primitives use lucide icons, as shadcn's do.
- **Give every control a name.** An icon-only button needs `aria-label`, and a field needs a label. The docs' Accessibility section lists what each item needs.
- **Show missing data honestly.** An empty list gets an empty state, not invented rows.

## Verify

Before you say a screen is done:

1. **Build it.** Run the project's typecheck and build. A prop that doesn't exist on this library fails here.
2. **Look at it in every theme the app uses.** At least Cosmos light and dark. Check that text is readable and that popovers and dialogs follow the theme.
3. **Use it from the keyboard.** Tab through it. Open each menu, select and dialog with the keyboard, move with the arrow keys, close with Escape, and check that focus returns where it started.
4. **Check the stylesheet** has the theme once: from the theme step, or from `tokens.css` and one theme file imported after Tailwind, with no `:root` or `.dark` rules of its own.

If something looks wrong, read the item's Markdown again before changing its files. Most problems are a missing theme, a stock `:root` that wins over imported theme files, a theme set below `<html>`, or an example from the other library.
