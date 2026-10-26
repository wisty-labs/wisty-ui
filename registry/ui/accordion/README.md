# Accordion

This page shows the Radix version. Base UI projects get [registry/base/ui/accordion.tsx](../../base/ui/accordion.tsx), and [ui.wisty.ai/accordion](https://ui.wisty.ai/accordion) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Stacks titled sections that expand to show content, one or several at a time.

```bash
npx shadcn@latest add @wisty/accordion
```

## Examples

- `default` (Account sections): An account's sections, one open at a time, the first opened with `defaultValue` and holding a link on its own line.
- `multiple` (Multiple open): Two of three sections open at once, set with `multiple` on `Accordion` (`type="multiple"` in Radix projects).
- `disabled` (Disabled section): The middle section disabled with `disabled` on its `AccordionItem`, and the first open.

## When to use

- A record or settings page has several groups of details, and people need only some of them at once: a record's details, opportunities and cases.
- A long page of related sections should start short, with people opening what they need.
- One section open at a time keeps a narrow panel short. Several open at once lets people compare sections.

## When not to use

- There's one block to show and hide. Use Collapsible.
- People switch between views of the same thing and never need two at once. Use Tabs.
- The content is short enough to show in full. Use Card with headings.
- The content is a list of records with actions. Use Table or Item.

## Usage

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

```text
Accordion
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent
```

In Radix projects, `Accordion` needs `type="single"` or `type="multiple"`, and `collapsible` lets the open section close. In Base UI projects, there's no `type`: pass `multiple` to let several sections open, give values as an array (`defaultValue={["details"]}`), and an open section always closes.

## Rules

- Give every `AccordionItem` a unique `value`.
- Keep titles to a few words of plain text. A button or link inside `AccordionTrigger` puts a control inside a button.
- Wrap content paragraphs in `p`, so they take the section's spacing.

## API reference

| Part | Built on |
| --- | --- |
| `Accordion` | [Radix Accordion.Root](https://www.radix-ui.com/primitives/docs/components/accordion#root) |
| `AccordionItem` | [Radix Accordion.Item](https://www.radix-ui.com/primitives/docs/components/accordion#item) |
| `AccordionTrigger` | [Radix Accordion.Trigger](https://www.radix-ui.com/primitives/docs/components/accordion#trigger) |
| `AccordionContent` | [Radix Accordion.Content](https://www.radix-ui.com/primitives/docs/components/accordion#content) |

## SLDS mapping

`Accordion` is `slds-accordion`, the base of `lightning-accordion`. `AccordionItem` is `slds-accordion__list-item` with its `slds-accordion__section`, and draws the line between sections. `AccordionTrigger` is `slds-accordion__summary-action` in `slds-accordion__summary-heading`, with the chevron, `slds-accordion__summary-action-icon`, before the title. `AccordionContent` is `slds-accordion__content`. Several open sections are `lightning-accordion`'s `allow-multiple-sections-open`.

Known gaps:

- SLDS's summary can hold an actions menu beside the title. Here the trigger is the whole row, so a menu can't sit in it. Put actions in the content.

## Keyboard interactions

| Keys                 | Action                                                                            |
| -------------------- | --------------------------------------------------------------------------------- |
| Space, Enter         | Opens or closes the focused section.                                              |
| Arrow Down, Arrow Up | Moves to the next or previous trigger, wrapping at the ends. Radix projects only. |
| Home, End            | Moves to the first or last trigger. Radix projects only.                          |

In Base UI projects, triggers move with Tab alone, and a disabled trigger stays in the tab order but won't open.

## Accessibility

- Each trigger is a button inside an `h3`. Put a level 2 heading above the accordion, as the examples do, so the page's headings stay in order.
- Content links are underlined only on hover, and in Cosmos dark a link inside a sentence barely differs from the muted text around it. Put a link on its own line.

## Responsive behavior

- The accordion fills its container's width.
- On screens narrower than 64rem (1024px), long titles wrap. From 64rem up, a long title stays on one line and ends in an ellipsis, so keep titles short enough to read when cut.

## Example code

### Account sections

An account's sections, one open at a time, the first opened with `defaultValue` and holding a link on its own line.

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AccordionDefault() {
  return (
    <div className="w-full max-w-md">
      <h2 className="font-semibold">Acme Corporation</h2>
      <Accordion type="single" collapsible defaultValue="details">
        <AccordionItem value="details">
          <AccordionTrigger>Account details</AccordionTrigger>
          <AccordionContent>
            <p>
              Acme is a manufacturing customer in San Francisco with 1,200
              employees and two subsidiaries.
            </p>
            <p>
              <a href="#">View account hierarchy</a>
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="opportunities">
          <AccordionTrigger>Open opportunities</AccordionTrigger>
          <AccordionContent>
            Acme - 1,200 Widgets, Proposal, $120,000, closes Nov 14
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="cases">
          <AccordionTrigger>Recent cases</AccordionTrigger>
          <AccordionContent>
            Case 00001026, Shipping delay, Escalated
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
```

### Multiple open

Two of three sections open at once, set with `multiple` on `Accordion` (`type="multiple"` in Radix projects).

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccordionMultiple() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h2>Account information</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["billing", "shipping"]}>
          <AccordionItem value="billing">
            <AccordionTrigger>Billing address</AccordionTrigger>
            <AccordionContent>
              1 Market St, San Francisco, CA 94105
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping address</AccordionTrigger>
            <AccordionContent>
              500 Howard St, San Francisco, CA 94105
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="system">
            <AccordionTrigger>System information</AccordionTrigger>
            <AccordionContent>
              Created by Ada Lovelace on October 5, 2026
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
```

### Disabled section

The middle section disabled with `disabled` on its `AccordionItem`, and the first open.

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccordionDisabled() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h2>Opportunity: Acme - 1,200 Widgets</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="products">
          <AccordionItem value="products">
            <AccordionTrigger>Products</AccordionTrigger>
            <AccordionContent>1,200 Widgets at $100 each</AccordionContent>
          </AccordionItem>
          <AccordionItem value="quotes" disabled>
            <AccordionTrigger>Quote lines</AccordionTrigger>
            <AccordionContent>
              Add a price book to create quotes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="history">
            <AccordionTrigger>Stage history</AccordionTrigger>
            <AccordionContent>
              Prospecting on Sep 2, Qualification on Sep 20, Proposal on Oct 1
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
```
