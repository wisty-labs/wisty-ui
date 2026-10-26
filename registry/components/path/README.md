# Path

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/path](https://ui.wisty.ai/path) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a record's stages as chevrons, with the current one and an action.

```bash
npx shadcn@latest add @wisty/path
```

## Examples

- `default` (Lead status): Selecting a stage sets `value` and only looks at it, and the button then moves `current` there, or completes the current stage.
- `states` (States): A later `current` stage, another stage selected with `defaultValue`, and paths closed as won and lost with `status`.

## When to use

- A record moves through a fixed process, like a lead's status or an opportunity's stage, and people need to see where it is and move it on. It usually sits right under the record page's header.
- People should be able to look at another stage before they move the record there.
- A process ends as won or lost.

## When not to use

- For steps someone completes in a form or setup flow. Use Progress indicator.
- For switching between views of content. Use Tabs.
- For a percentage. Use Progress.
- For more stages than fit across the page. Path has no scroll controls yet. Keep it to about seven stages.

## Usage

Give `Path` its stages in order, the `current` one and an `aria-label`, with the action, usually a Button, as its children.

```tsx
import { Button } from "@/components/ui/button"
import { Path } from "@/components/wisty/path"
```

```tsx
<Path
  aria-label="Opportunity stage"
  steps={[
    { value: "prospecting", label: "Prospecting" },
    { value: "qualification", label: "Qualification" },
    { value: "proposal", label: "Proposal" },
  ]}
  current="qualification"
>
  <Button>Mark Stage as Complete</Button>
</Path>
```

Selecting a stage only looks at it. Your button's label follows the selection: "Mark as Current Stage" when another stage is selected, "Mark Status as Complete" when the current one is. The Lead status example shows both.

## Rules

- Change `current` from your own button, never on selection.
- Use `status` only when `current` is the last stage, labelled "Closed Won" or "Closed Lost".
- Put the Button directly in `Path`'s children. The action area sizes only a direct button; a wrapper around it loses that.
- Never pass `asChild` or `render`.

## API reference

### Path

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | Names the stages for screen readers, like "Lead status". |
| `children`? | `React.ReactNode` |  | The action area after the stages, usually a Button. |
| `steps` | `{ value: string; label: string }[]` |  | The stages, in order. |
| `current` | `string` |  | The stage the record is at. Earlier stages show as complete. |
| `value`? | `string` |  | The selected stage. Defaults to the current one. |
| `defaultValue`? | `string` |  |  |
| `onValueChange`? | `(value: string) => void` |  |  |
| `status`? | `"won" \| "lost"` |  | Closes the path at the current stage as won or lost. |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

## SLDS mapping

`Path` is `slds-path`, the stages are `slds-path__nav`, and each stage is a `slds-path__item` with a `slds-path__link` inside. The action area is `slds-path__action` with `slds-path__stage-name`, and a Button in it is `slds-path__mark-complete`. The check is Lucide's where SLDS draws `utility:check`.

Known gaps:

- Coaching (`slds-path_has-coaching`: key fields and guidance per stage, with a toggle) isn't covered. It will build on Tabs.
- SLDS's scroll controls for a path wider than its container (`slds-has-overflow`) aren't covered. Stages shrink to their minimum width, then the path clips.
- SLDS's "Mark as Current Stage" button color (`slds-path__mark-current`) isn't applied; use the brand Button.

## Keyboard interactions

| Key         | Action                                                               |
| ----------- | -------------------------------------------------------------------- |
| Right arrow | Moves focus and selection to the next stage. Stops at the last.      |
| Left arrow  | Moves focus and selection to the previous stage. Stops at the first. |

The stages are one tab stop, on the selected stage.

## Accessibility

- `aria-label` names the process for screen readers, like "Lead status" or "Opportunity stage". Name the process, not the control.
- The stages are a horizontal listbox. Complete stages start with hidden text, "Stage Complete", and the current stage with "Current Stage:", so don't add state words of your own to a label.

## Motion

- A complete stage's check flips to its name on hover, over 0.2s. With reduced motion it switches without the flip.

## Responsive behavior

- The stages share the width equally, each at least 5rem. Long names are cut off with an ellipsis, so keep stage labels to a word or two.
- Below 64rem the action area moves under the stages and shows "Stage:" with the selected stage's name; below 48rem it stacks, with a full-width button.

## Example code

### Lead status

Selecting a stage sets `value` and only looks at it, and the button then moves `current` there, or completes the current stage.

```tsx
"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Path } from "@/components/wisty/path"

const stages = [
  { value: "contacted", label: "Contacted" },
  { value: "open", label: "Open" },
  { value: "unqualified", label: "Unqualified" },
  { value: "nurturing", label: "Nurturing" },
  { value: "closed", label: "Closed" },
]

export default function PathDefault() {
  const [current, setCurrent] = useState("contacted")
  const [selected, setSelected] = useState("contacted")
  const next = stages[stages.findIndex((stage) => stage.value === current) + 1]

  return (
    <Path
      aria-label="Lead status"
      steps={stages}
      current={current}
      value={selected}
      onValueChange={setSelected}
    >
      {selected === current ? (
        <Button
          disabled={!next}
          onClick={() => {
            if (!next) return
            setCurrent(next.value)
            setSelected(next.value)
          }}
        >
          <CheckIcon />
          Mark Status as Complete
        </Button>
      ) : (
        <Button onClick={() => setCurrent(selected)}>
          Mark as Current Stage
        </Button>
      )}
    </Path>
  )
}
```

### States

A later `current` stage, another stage selected with `defaultValue`, and paths closed as won and lost with `status`.

```tsx
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Path } from "@/components/wisty/path"

const stages = [
  { value: "contacted", label: "Contacted" },
  { value: "open", label: "Open" },
  { value: "unqualified", label: "Unqualified" },
  { value: "nurturing", label: "Nurturing" },
]

export default function PathStates() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Path
        aria-label="Later stage"
        steps={[...stages, { value: "closed", label: "Closed" }]}
        current="nurturing"
      >
        <Button>
          <CheckIcon />
          Mark Status as Complete
        </Button>
      </Path>
      <Path
        aria-label="Another stage selected"
        steps={[...stages, { value: "closed", label: "Closed" }]}
        current="contacted"
        defaultValue="unqualified"
      >
        <Button>Mark as Current Stage</Button>
      </Path>
      <Path
        aria-label="Closed won"
        steps={[...stages, { value: "won", label: "Closed Won" }]}
        current="won"
        status="won"
      >
        <Button>Change Closed State</Button>
      </Path>
      <Path
        aria-label="Closed lost"
        steps={[...stages, { value: "lost", label: "Closed Lost" }]}
        current="lost"
        status="lost"
      >
        <Button>Change Closed State</Button>
      </Path>
    </div>
  )
}
```
