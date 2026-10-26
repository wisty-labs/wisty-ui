# Tabs

This page shows the Radix version. Base UI projects get [registry/base/ui/tabs.tsx](../../base/ui/tabs.tsx), and [ui.wisty.ai/tabs](https://ui.wisty.ai/tabs) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Switches between panels of related content.

```bash
npx shadcn@latest add @wisty/tabs
```

## Examples

- `default` (Record tabs): An account's Activity, Details and Related tabs, Details open.
- `scoped` (Scoped): Bordered tabs whose panel continues the border, set with `variant="scoped"` on `TabsList`, and Quotes `disabled` until a price book is chosen.
- `vertical` (Vertical): Tabs in a column beside their panel, set with `orientation="vertical"` on `Tabs` and `variant="scoped"` on `TabsList`.

## When to use

- To switch between a few related views of one record or object, like an account's Activity, Details and Related.
- The sections are peers. People visit them in any order, don't need two at once, and each has a one or two word label.
- For a boxed tab set inside a card or region. Use `variant="scoped"` on `TabsList`.
- For a settings or setup panel with more sections than fit on one row, as tabs in a column beside the panel. Use `orientation="vertical"` on `Tabs` with `variant="scoped"` on `TabsList`.

## When not to use

- People need several sections at once. Use Accordion.
- Each tab should open its own page or change the URL. Use your router's links in a `nav`, so the back button and open-in-new-tab work.
- The sections are stages in a process, like an opportunity moving from Prospecting to Closed Won. Use Path.
- You're switching between two or three ways to show the same data, like a list and a grid. Use Toggle Group.

## Usage

```text
Tabs
├── TabsList
│   └── TabsTrigger
└── TabsContent
```

Set `defaultValue` to the tab that opens first, and give every `TabsTrigger` a `TabsContent` with the same `value`.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

```tsx
<Tabs defaultValue="overview">
  <TabsList aria-label="Opportunity">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="history">History</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">{/* overview panel */}</TabsContent>
  <TabsContent value="history">{/* history panel */}</TabsContent>
</Tabs>
```

The two bases differ in when a tab is selected. In Radix projects the arrows select each tab they reach; set `activationMode="manual"` on `Tabs` to select with Enter or Space instead. In Base UI projects the arrows only move focus and Enter or Space selects; set `activateOnFocus` on `TabsList` to select as the arrows move. Without `defaultValue` or `value`, Radix projects select no tab and show no panel, and Base UI projects select the first tab that isn't disabled.

## Rules

- Every `TabsTrigger` needs a `TabsContent` with the same `value`, unique within one `Tabs`.
- Always set `defaultValue`, or `value` with `onValueChange`, so the same tab opens in every project.
- Don't wrap default tabs in your own border to imitate scoped tabs; use `variant="scoped"`.
- Don't restyle the bar, hover or active colors with classes. The `--tabs-*` tokens change per theme.
- Mark an unavailable tab with `disabled`, not `aria-disabled` or `pointer-events-none`.
- Keep `TabsList` and every `TabsContent` inside the same `Tabs`, with the panels after the list, and don't nest one tab set inside another's panel: variant and orientation styles match any ancestor `Tabs`, so they leak between levels.

## API reference

| Part | Built on |
| --- | --- |
| `Tabs` | [Radix Tabs.Root](https://www.radix-ui.com/primitives/docs/components/tabs#root) |
| `TabsList` | [Radix Tabs.List](https://www.radix-ui.com/primitives/docs/components/tabs#list) |
| `TabsTrigger` | [Radix Tabs.Trigger](https://www.radix-ui.com/primitives/docs/components/tabs#trigger) |
| `TabsContent` | [Radix Tabs.Content](https://www.radix-ui.com/primitives/docs/components/tabs#content) |

### Tabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation`? | `"horizontal" \| "vertical"` | `"horizontal"` | The orientation the tabs are layed out. |

### TabsList

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "line" \| "scoped"` | `"default"` |

## SLDS mapping

`Tabs` is the `slds-tabs_default` wrapper, `TabsList` its `slds-tabs_default__nav`, `TabsTrigger` the `slds-tabs_default__item` and its `slds-tabs_default__link` in one `button`, and `TabsContent` is `slds-tabs_default__content`. With `variant="scoped"` each part takes the `slds-tabs_scoped` class instead, and `aria-selected` does the job of `slds-is-active`. With `orientation="vertical"` and `variant="scoped"`, `Tabs` is `slds-vertical-tabs`, `TabsList` its `slds-vertical-tabs__nav`, `TabsTrigger` the `slds-vertical-tabs__nav-item` and its `slds-vertical-tabs__link`, and `TabsContent` `slds-vertical-tabs__content`.

Known gaps:

- No icon pushed to the end of a vertical tab (`slds-vertical-tabs__right-icon`). An icon in `TabsTrigger` sits beside its label.
- No overflow menu (`slds-tabs__item_overflow`), and the list doesn't scroll.
- No size prop for `slds-tabs_medium` and `slds-tabs_large`.
- SLDS has no disabled tab. A disabled tab here takes the theme's disabled text color.
- Sub-tabs (`slds-sub-tabs`) and the unsaved and notification states (`slds-is-unsaved`, `slds-has-notification`) aren't covered.

## Keyboard interactions

| Keys                 | Action                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| Right Arrow          | Moves focus to the next tab, and selects it when tabs activate on focus. Wraps at the end.       |
| Left Arrow           | Moves focus to the previous tab, and selects it when tabs activate on focus. Wraps at the start. |
| Down Arrow, Up Arrow | With `orientation="vertical"`, move to the next and previous tab. Left and Right do nothing.     |
| Home, End            | Moves focus to the first or last tab, and selects it when tabs activate on focus.                |
| Enter, Space         | Selects the focused tab, when the arrows only move focus.                                        |

## Accessibility

- Name the tab set with `aria-label` on `TabsList`, or `aria-labelledby` with the id of a visible heading.
- The roles and states (`tablist`, `tab` with `aria-selected` and `aria-controls`, `tabpanel`) are set for you. Don't add them by hand.
- Only the selected tab is in the Tab order; the arrows reach the rest. The active panel takes focus too, so a panel that holds only text is reachable.
- A disabled tab can't be selected and is announced as unavailable. Say why in nearby text.
- The selected tab doesn't rely on color alone: default tabs show a bar, and a scoped tab opens into its panel.

## Motion

- Tabs switch at once and the bar doesn't slide, so a change jumps, and reduced motion changes nothing. If you add a panel transition, put it behind `motion-safe:`.

## Responsive behavior

- The list fills its container. Tabs keep their width and never wrap or shrink, and there's no scrolling or overflow menu, so labels that don't fit run past the end of the list. Keep labels short and the count low, and test at the narrowest width you support.
- Vertical scoped tabs keep a 15rem tab column at every width and wrap a long label onto a second line. Only the panel narrows, so in a narrow container use horizontal tabs.

## Performance

- Only the active panel renders its children, so a heavy panel costs nothing until someone opens it.
- Switching tabs unmounts the old panel's children, so their state, like typed input, resets. Keep state that has to survive a switch above `Tabs`.

## Example code

### Record tabs

An account's Activity, Details and Related tabs, Details open.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDefault() {
  return (
    <Tabs defaultValue="details" className="w-full max-w-md">
      <TabsList aria-label="Acme Corporation">
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="related">Related</TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        No upcoming activities. Past activities you log show up here.
      </TabsContent>
      <TabsContent value="details">
        Acme is a manufacturing customer in San Francisco, owned by Jordan Lee.
      </TabsContent>
      <TabsContent value="related">
        3 contacts, 2 opportunities and 1 case.
      </TabsContent>
    </Tabs>
  )
}
```

### Scoped

Bordered tabs whose panel continues the border, set with `variant="scoped"` on `TabsList`, and Quotes `disabled` until a price book is chosen.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsScoped() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList variant="scoped" aria-label="Edge Installation">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="quotes" disabled>
          Quotes
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Stage Negotiation, amount $120,000, closes Nov 14, 2026.
      </TabsContent>
      <TabsContent value="quotes">
        Quotes open once a price book is chosen.
      </TabsContent>
      <TabsContent value="history">
        Field history for the last 90 days.
      </TabsContent>
    </Tabs>
  )
}
```

### Vertical

Tabs in a column beside their panel, set with `orientation="vertical"` on `Tabs` and `variant="scoped"` on `TabsList`.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsVertical() {
  return (
    <Tabs
      defaultValue="personal"
      orientation="vertical"
      className="w-full max-w-2xl"
    >
      <TabsList variant="scoped" aria-label="My Settings">
        <TabsTrigger value="personal">Personal Information</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="display">Display & Layout</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        Jordan Lee, Account Executive, in the Pacific time zone.
      </TabsContent>
      <TabsContent value="notifications">
        Email me when a case is assigned to me or a record I follow changes.
      </TabsContent>
      <TabsContent value="display">
        Comfy density, with the Sales app opening first.
      </TabsContent>
      <TabsContent value="calendar">
        Working hours 9:00 AM to 5:00 PM, Monday to Friday.
      </TabsContent>
    </Tabs>
  )
}
```
