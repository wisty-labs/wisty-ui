# Expandable section

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/expandable-section](https://ui.wisty.ai/expandable-section) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Opens and closes a titled section of a page from its gray title bar. Closed content stays mounted, hidden.

```bash
npx shadcn@latest add @wisty/expandable-section
```

## Examples

- `default` (Opportunity sections): Description Information open and System Information closed, each title a heading holding the button that opens and closes it.

## When to use

- A page's content falls into titled sections people fold away one by one, like a record's Description Information and System Information.
- The closed content must stay on the page, like form fields that still save, or state that survives closing.
- A section of a Lightning page with a gray title bar and a chevron, as a record page's sections are.

## When not to use

- Opening one section should close the others. Use Accordion.
- The trigger isn't a title bar, like a "Show more" link or an icon button on a row. Use Collapsible and style the trigger.
- A record's fields in the page layout's sections. Use Record detail, which draws its sections with this.
- The content never folds. Use a heading.

## Usage

```tsx
import {
  ExpandableSection,
  ExpandableSectionContent,
  ExpandableSectionTrigger,
} from "@/components/wisty/expandable-section"
```

```text
ExpandableSection
├── ExpandableSectionTrigger
└── ExpandableSectionContent
```

```tsx
<ExpandableSection defaultOpen>
  <ExpandableSectionTrigger>Description Information</ExpandableSectionTrigger>
  <ExpandableSectionContent>…</ExpandableSectionContent>
</ExpandableSection>
```

Sections start closed; pass `defaultOpen` to start one open, or `open` and `onOpenChange` to control it. `headingLevel` on the trigger sets the heading around the title button.

## Rules

- Keep the title to a few words: it truncates on one line.
- Put the content inside `ExpandableSectionContent`; anything else in the section stays visible when it closes.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `ExpandableSection` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | A titled section of a page that people open and close from its title. |
| `ExpandableSectionTrigger` | [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button) | The section's title: a heading holding the button that opens and closes it. |
| `ExpandableSectionContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | What the section holds. It stays mounted while closed, hidden. |

### ExpandableSection

A titled section of a page that people open and close from its title.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open`? | `boolean` |  | Whether the section is open, controlled. |
| `defaultOpen`? | `boolean` | `false` | Whether the section starts open, uncontrolled. Default false. |
| `onOpenChange`? | `(open: boolean) => void` |  | Called when the title opens or closes the section. |

### ExpandableSectionTrigger

The section's title: a heading holding the button that opens and closes it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `headingLevel`? | `2 \| 3 \| 4 \| 5 \| 6` | `2` | The level of the heading around the button. Default 2. |

## SLDS mapping

`ExpandableSection` is `slds-section` (`slds-is-open` while open), `ExpandableSectionTrigger` is the `slds-section__title` heading holding the `slds-section__title-action` button with its `slds-section__title-action-icon` chevron and the title in `slds-truncate`, and `ExpandableSectionContent` is `slds-section__content`.

Known gaps:

- The chevron is lucide's `ChevronDownIcon`. SLDS uses its `utility:switch` caret.
- No height animation: SLDS shows and hides the content at once, and so does this.

## Keyboard interactions

| Key            | Action                           |
| -------------- | -------------------------------- |
| Tab            | Moves focus to the title button. |
| Enter or Space | Opens or closes the section.     |

## Accessibility

- Set `headingLevel` to the level after the page's last heading, so each section shows in the outline. It's 2 by default, under a page's h1.
- The title button reports `aria-expanded` and names the content it controls with `aria-controls`.
- Closed content is `hidden`, so screen readers and find-in-page skip it until the section opens.

## Example code

### Opportunity sections

Description Information open and System Information closed, each title a heading holding the button that opens and closes it.

```tsx
import {
  ExpandableSection,
  ExpandableSectionContent,
  ExpandableSectionTrigger,
} from "@/components/wisty/expandable-section"

export default function ExpandableSectionDefault() {
  return (
    <div className="w-full max-w-xl">
      <ExpandableSection defaultOpen>
        <ExpandableSectionTrigger>
          Description Information
        </ExpandableSectionTrigger>
        <ExpandableSectionContent>
          <p>
            Edge Communications is replacing the backup generators at its three
            Austin sites before the summer storm season.
          </p>
        </ExpandableSectionContent>
      </ExpandableSection>
      <ExpandableSection>
        <ExpandableSectionTrigger>System Information</ExpandableSectionTrigger>
        <ExpandableSectionContent>
          <p>Created by Jordan Lee on October 12, 2026.</p>
        </ExpandableSectionContent>
      </ExpandableSection>
    </div>
  )
}
```
