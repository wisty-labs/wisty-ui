# Progress indicator

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/progress-indicator](https://ui.wisty.ai/progress-indicator) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows the steps of a wizard or setup flow and which one people are on. For a record's stages, use Path.

```bash
npx shadcn@latest add @wisty/progress-indicator
```

## Examples

- `default` (New opportunity): Four steps with the second current at `value={1}`: the first shows a check, and each marker shows its label in a tooltip.
- `error` (Step with an error): Setting `error` on the current step replaces its marker with an error mark, and screen readers hear "Account - Error".
- `shade` (On a gray background): With `variant="shade"`, the space around each marker takes the gray background instead of white.
- `vertical` (Vertical): A setup list with `orientation="vertical"`: labels beside a line, and a `ProgressIndicatorContent` adding a description to one step.
- `interactive` (Moving between steps): With `onValueChange`, clicking an earlier step goes back to it, Back and Next move the current step, and later steps stay unavailable.

## When to use

- People work through three or more steps in order, like a new record wizard, a guided setup or an import, and need to see which steps are done, which one they're on and how many are left.
- A step can fail and people need to see which one, like an import step whose file was rejected. Set `error` on it.
- People may go back to a finished step. Pass `onValueChange`, and `selectAhead` if they may also skip ahead.
- A setup list shows each step's name and a line of detail. Use `orientation="vertical"`.
- It replaces `lightning-progress-indicator` with `type="base"`.

## When not to use

- A record moves through its stages, like an opportunity's stage or a lead's status. Use Path.
- You show how much of a task is done as a percentage, like an upload. Use Progress.
- The sections can be visited in any order. Use Tabs.
- There are only two steps, or more than about six. Two steps don't need an indicator. For more, group them into phases and show the phases.

## Usage

```tsx
import {
  ProgressIndicator,
  ProgressIndicatorContent,
  ProgressIndicatorStep,
} from "@/components/wisty/progress-indicator"
```

```text
ProgressIndicator
└── ProgressIndicatorStep
    └── ProgressIndicatorContent
```

```tsx
<ProgressIndicator value={1} aria-label="New opportunity">
  <ProgressIndicatorStep label="Contact" />
  <ProgressIndicatorStep label="Account" />
  <ProgressIndicatorStep label="Review" />
</ProgressIndicator>
```

- `value` is the current step's index, from 0. Steps before it are complete; the number of steps marks them all complete.
- Your app moves `value`, usually from Back and Next buttons. `onValueChange` gets the index of a step someone clicks, so a wizard can go back to it with `onValueChange={setStep}`. Without it, the markers only show their labels.
- Vertical, a step shows its `label` beside the marker. To add a description or an action, give the step a `ProgressIndicatorContent` as its child, holding the name and the rest; it takes the label's place.

## Rules

- Keep every `ProgressIndicatorStep` a direct child of `ProgressIndicator`, with nothing else between them. A step's position is its index, so a wrapper or fragment counts as one step.
- Use `variant="shade"` only on a gray background. On white, its gray rings show around every marker.
- `onValueChange` and `selectAhead` act on horizontal markers only. In a vertical indicator, a step's children are the only way to act on it.
- Give every step a short `label`, under 30 characters. Horizontal, it's only seen in a tooltip.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `ProgressIndicator` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `ProgressIndicatorStep` | [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/li) |
| `ProgressIndicatorContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### ProgressIndicator

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | Names the process for screen readers, like "New opportunity". |
| `variant`? | `"base" \| "shade"` | `"base"` |  |
| `orientation`? | `"horizontal" \| "vertical"` | `"horizontal"` |  |
| `value` | `number` |  | The current step's index, from 0; earlier steps are complete. The step count completes all. |
| `onValueChange`? | `(value: number) => void` |  | Called with a step's index when it's clicked. Makes the markers selectable. |
| `selectAhead`? | `boolean` | `false` | Lets people select steps after the current one. |

### ProgressIndicatorStep

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` |  | The step's name: the marker's tooltip and name, or the text beside a vertical marker. |
| `error`? | `boolean` | `false` | Marks the step as having an error, wherever it is. |
| `disabled`? | `boolean` | `false` | Keeps people from selecting the step. |

## SLDS mapping

`ProgressIndicator` is `slds-progress` with the steps as `slds-progress__list` and the track as an x-small `slds-progress-bar` with its `slds-progress-bar__value`. `ProgressIndicatorStep` is `slds-progress__item` with its `slds-progress__marker`, as a button when horizontal, as `lightning-progress-indicator` renders it. Complete and error steps use `slds-progress__marker_icon`. `ProgressIndicatorContent` is `slds-progress__item_content`. The step's tooltip is Tooltip.

Known gaps:

- The complete and error marks are Lucide's circle check and ban, filled to stand for `utility:success` and `utility:error`.
- The vertical indicator's green line (`slds-progress_success`), its green check (`slds-progress__marker_icon-success`) and the borders between steps (`slds-progress__list-bordered`) aren't variants. Add a bottom border to `ProgressIndicatorContent` for the borders.
- `lightning-progress-indicator`'s path type is Path.
- The hidden state words ("Completed", "Active", "Error") are English.

## Accessibility

- Name the process with `aria-label`, like "New opportunity". It names both the list of steps and the progress bar.
- Each horizontal marker is named by its label and state, like "Contact - Completed" or "Account - Active", so keep state words out of labels. The current step also has `aria-current="step"`.
- Every horizontal marker is a tab stop, so people can reach each tooltip. The arrow keys don't move between steps, as in SLDS.
- With `onValueChange`, steps people can't select (later steps without `selectAhead`, and `disabled` ones) stay focusable and are marked `aria-disabled`, so their tooltips still open.
- Vertical markers aren't focusable. Put any action in the step's `ProgressIndicatorContent`.

## Responsive behavior

- The horizontal indicator takes 70% of its container's width, centered, as SLDS draws it, and spreads its markers evenly from end to end. In a row with buttons, like a dialog's footer, it takes the space between them.

## Example code

### New opportunity

Four steps with the second current at `value={1}`: the first shows a check, and each marker shows its label in a tooltip.

```tsx
import {
  ProgressIndicator,
  ProgressIndicatorStep,
} from "@/components/wisty/progress-indicator"

export default function ProgressIndicatorDefault() {
  return (
    <ProgressIndicator value={1} aria-label="New opportunity">
      <ProgressIndicatorStep label="Contact" />
      <ProgressIndicatorStep label="Account" />
      <ProgressIndicatorStep label="Opportunity" />
      <ProgressIndicatorStep label="Review" />
    </ProgressIndicator>
  )
}
```

### Step with an error

Setting `error` on the current step replaces its marker with an error mark, and screen readers hear "Account - Error".

```tsx
import {
  ProgressIndicator,
  ProgressIndicatorStep,
} from "@/components/wisty/progress-indicator"

export default function ProgressIndicatorError() {
  return (
    <ProgressIndicator value={1} aria-label="New opportunity">
      <ProgressIndicatorStep label="Contact" />
      <ProgressIndicatorStep label="Account" error />
      <ProgressIndicatorStep label="Opportunity" />
      <ProgressIndicatorStep label="Review" />
    </ProgressIndicator>
  )
}
```

### On a gray background

With `variant="shade"`, the space around each marker takes the gray background instead of white.

```tsx
import {
  ProgressIndicator,
  ProgressIndicatorStep,
} from "@/components/wisty/progress-indicator"

export default function ProgressIndicatorShade() {
  return (
    <div className="w-full bg-muted p-4">
      <ProgressIndicator variant="shade" value={2} aria-label="New opportunity">
        <ProgressIndicatorStep label="Contact" />
        <ProgressIndicatorStep label="Account" />
        <ProgressIndicatorStep label="Opportunity" />
        <ProgressIndicatorStep label="Review" />
      </ProgressIndicator>
    </div>
  )
}
```

### Vertical

A setup list with `orientation="vertical"`: labels beside a line, and a `ProgressIndicatorContent` adding a description to one step.

```tsx
import {
  ProgressIndicator,
  ProgressIndicatorContent,
  ProgressIndicatorStep,
} from "@/components/wisty/progress-indicator"

export default function ProgressIndicatorVertical() {
  return (
    <ProgressIndicator
      orientation="vertical"
      value={2}
      aria-label="Set up your org"
      className="max-w-md"
    >
      <ProgressIndicatorStep label="Add users" />
      <ProgressIndicatorStep label="Import accounts and contacts" />
      <ProgressIndicatorStep label="Connect your email">
        <ProgressIndicatorContent>
          <div>
            <p>Connect your email</p>
            <p className="text-muted-foreground">
              Sync Gmail or Outlook so emails and meetings are logged to the
              right records.
            </p>
          </div>
        </ProgressIndicatorContent>
      </ProgressIndicatorStep>
      <ProgressIndicatorStep label="Install the Salesforce mobile app" />
    </ProgressIndicator>
  )
}
```

### Moving between steps

With `onValueChange`, clicking an earlier step goes back to it, Back and Next move the current step, and later steps stay unavailable.

```tsx
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  ProgressIndicator,
  ProgressIndicatorStep,
} from "@/components/wisty/progress-indicator"

export default function ProgressIndicatorInteractive() {
  const [step, setStep] = useState(2)

  return (
    <div className="flex w-full items-center gap-4">
      <Button
        variant="outline"
        disabled={step === 0}
        onClick={() => setStep(step - 1)}
      >
        Back
      </Button>
      <ProgressIndicator
        value={step}
        onValueChange={setStep}
        aria-label="New opportunity"
      >
        <ProgressIndicatorStep label="Contact" />
        <ProgressIndicatorStep label="Account" />
        <ProgressIndicatorStep label="Opportunity" />
        <ProgressIndicatorStep label="Review" />
      </ProgressIndicator>
      <Button disabled={step === 3} onClick={() => setStep(step + 1)}>
        Next
      </Button>
    </div>
  )
}
```
