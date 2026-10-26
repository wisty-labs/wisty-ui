# Markdown

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/markdown](https://ui.wisty.ai/markdown) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows markdown text as formatted prose, like an AI answer or summary. People can't edit it, and embedded HTML shows as text.

```bash
npx shadcn@latest add @wisty/markdown
```

## Examples

- `default` (Account summary): An AI summary of an account: a paragraph with a bold figure, then next steps as a bulleted list.
- `rich-text` (Description field): Headings rendered a level down (`#` as h2), an underlined link, a quote, a numbered list with a nested list, a rule and struck-through text.
- `table` (Table): A GitHub table of opportunities drawn with the Table parts, its Amount column right-aligned by the `---:` delimiter.
- `code` (Code): Inline code in a sentence, then a fenced SOQL block on a gray surface, without highlighting.
- `tasks` (Task list): A GitHub task list: two done and two to do, each a disabled checkbox named by its item.

## When to use

- Text a model wrote in markdown: an Agentforce-style answer, an AI summary on a record, a drafted email shown for review.
- A text field whose content is written in markdown, like a Long Text Area Description with headings, links and lists.
- Help text, release notes or instructions kept as markdown and shown on a page.
- It covers GitHub's additions too: tables, task lists and strikethrough.

## When not to use

- People write or edit the text. Markdown only shows it, and a rich text editor isn't built yet.
- A Rich Text Area field, which stores HTML. Embedded HTML shows as text here, tags and all. Sanitize and convert it to markdown first.
- Plain text with no formatting, like a field's value on a record. Use Output field.
- Code that needs highlighting or line numbers. Code blocks here are plain monospace text.
- Data people sort or act on. A markdown table is static. Use Data table.

## Usage

```tsx
import { Markdown } from "@/components/wisty/markdown"
```

```tsx
<Markdown>{answer}</Markdown>
```

- The source is the only child, as a string. An empty or blank string renders nothing, not an empty box.
- A markdown `#` heading renders as an h2, since the page has its own h1, and each deeper level follows. Set `headingLevel` to the level `#` should take under your section's heading, like `headingLevel={4}` under an h3.
- `components` replaces a renderer by element name, like `components={{ a: RecordLink }}` to open links in your app's router. A replaced heading isn't shifted by `headingLevel`, and a replaced link doesn't get `rel`.
- Streaming isn't handled: pass the text you have, and it renders as markdown so far. An unfinished `**bold` shows its asterisks, an unclosed code fence runs to the end of the text as code, and a half-typed link shows its URL.

## Rules

- Never add a plugin that parses raw HTML, like `rehype-raw`. Model output and field values can carry script and event attributes; here they stay text.
- Links to other sites get `rel="noopener noreferrer"`, and links with unsafe protocols, like `javascript:`, show as text. A link opens in the same tab; replace the `a` renderer to change that.
- Put it on a container surface (`bg-background`), as a card is. Its text, code surface and borders are colored for that surface, in light and dark.
- Never pass `asChild` or `render`.

## API reference

### Markdown

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` |  | The markdown source. An empty or blank string renders nothing. |
| `components`? | `Components` |  | Renderers replacing the built-in ones, as react-markdown's; a replaced heading isn't shifted. |
| `headingLevel`? | `HeadingLevel` | `2` | The level a markdown `#` heading renders as. Deeper ones follow, up to h6. |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### HeadingLevel

```ts
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
```

## SLDS mapping

`Markdown` is `slds-markdown`, the prose SLDS 2 draws a model's markdown answer in. Paragraphs, headings, lists, quotes, code, code blocks, tables, images and struck-through text take its element styles. Tables are the Table parts redrawn as its table, a rule is the Separator, and a task's box is its checkbox in a list item.

Known gaps:

- No variant for `slds-text-longform` or `slds-rich-text-editor__output`. Both are older prose styles for HTML content; the rich text output also leaves paragraphs without spacing, which suits a rich text editor's HTML but not markdown.
- No syntax highlighting in code blocks, as in SLDS.

## Accessibility

- Headings join the page's outline. Set `headingLevel` so the first one sits one level under the section that holds it.
- A task's checkbox is disabled and named by its item's text, so screen readers hear each task and whether it's done. People can't tick it.
- An image keeps the alt text written in the markdown, `![Burlington plant](…)`. Ask the model for alt text, or the image is skipped by screen readers.
- Links are underlined, unlike Lightning's, so they stand out from the text by more than color. Keep the underline if you restyle them.
- A table has no caption. Introduce it in a sentence just above, as the table example does.

## Example code

### Account summary

An AI summary of an account: a paragraph with a bold figure, then next steps as a bulleted list.

```tsx
import { Markdown } from "@/components/wisty/markdown"

const summary = `Edge Communications renewed in June 2026 for **$1.2M** over three years, up 18% on the last term. Service Cloud usage grew in every region, and open cases are down to 12.

Next steps:

- Book the Q3 business review with Rose Gonzalez
- Send the Field Service quote before August 14
- Close the two Priority 1 cases at the Austin site`

export default function MarkdownDefault() {
  return <Markdown className="max-w-md">{summary}</Markdown>
}
```

### Description field

Headings rendered a level down (`#` as h2), an underlined link, a quote, a numbered list with a nested list, a rule and struck-through text.

```tsx
import { Markdown } from "@/components/wisty/markdown"

const description = `# Account overview

Burlington Textiles Corp of America makes weaving equipment for apparel mills. Its 2025 results are in the [annual report](https://www.example.com/burlington/annual-report).

Jack Rogers, VP of Operations, on the last call:

> We want one support contract for all three plants.

## Renewal plan

1. Confirm the contract end date with Legal
2. Review the support entitlements
   - Premier Success for the Burlington plant
   - Standard Success for the other two
3. Send the renewal quote to Jack Rogers

---

The close date moved from ~~June 30~~ to July 15.`

export default function MarkdownRichText() {
  return <Markdown className="max-w-md">{description}</Markdown>
}
```

### Table

A GitHub table of opportunities drawn with the Table parts, its Amount column right-aligned by the `---:` delimiter.

```tsx
import { Markdown } from "@/components/wisty/markdown"

const answer = `Three opportunities close this quarter:

| Opportunity | Stage | Amount | Close date |
| --- | --- | ---: | --- |
| Edge Emergency Generator | Negotiation | $75,000 | Jul 15, 2026 |
| Burlington Textiles Weaving Plant | Proposal | $235,000 | Aug 3, 2026 |
| GenePoint Lab Generators | Qualification | $60,000 | Sep 30, 2026 |`

export default function MarkdownTable() {
  return <Markdown>{answer}</Markdown>
}
```

### Code

Inline code in a sentence, then a fenced SOQL block on a gray surface, without highlighting.

```tsx
import { Markdown } from "@/components/wisty/markdown"

const answer = `Filter on \`IsClosed = false\` to get the open cases for an account:

\`\`\`sql
SELECT CaseNumber, Subject, Priority
FROM Case
WHERE AccountId = '001Dn00000Edge01' AND IsClosed = false
ORDER BY CreatedDate DESC
\`\`\``

export default function MarkdownCode() {
  return <Markdown className="max-w-md">{answer}</Markdown>
}
```

### Task list

A GitHub task list: two done and two to do, each a disabled checkbox named by its item.

```tsx
import { Markdown } from "@/components/wisty/markdown"

const checklist = `- [x] Confirm the renewal amount with Finance
- [x] Move the close date to June 30
- [ ] Send the order form to Rose Gonzalez
- [ ] Book the kickoff call`

export default function MarkdownTasks() {
  return <Markdown>{checklist}</Markdown>
}
```
