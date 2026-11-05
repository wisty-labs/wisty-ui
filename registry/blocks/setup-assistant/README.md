# Setup assistant

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/setup-assistant](https://ui.wisty.ai/setup-assistant) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A setup checklist with actions, step progress and expandable substeps.

```bash
npx shadcn@latest add @wisty/setup-assistant
```

## Examples

- `default` (Sales Setup Assistant): Confirming account data advances its substeps, the switch completes its step, and the header counts finished steps.
- `list` (Steps without progress): Untracked steps with no rings, a setup page, a guide and a switch, without a card or summary.
- `partial` (Progress not fully available): Available steps stay visible, unknown progress is named, a setting with no handler reads On as text, and no overall percentage is guessed.
- `empty` (No setup steps): A complete empty checklist says there are no steps to show, without claiming setup is finished.
- `unavailable` (Setup unavailable): An unavailable checklist explains what couldn't be read instead of showing an empty list.
- `loading` (Loading setup): Placeholder rows hold the list's shape while setup loads, without an invented completion value.

## When to use

- On a Setup or onboarding page that walks an admin through numbered steps, like Lightning's Setup Assistant for Sales Cloud or Service Cloud.
- When each step shows how far along it is, with a button, a link or a switch that does it.
- When a step breaks into substeps done in order, shown when the step expands.
- When a card's header counts how many steps are done.

## When not to use

- For a record's stage or status. Use Path.
- For a wizard's position, moved by Back and Next. Use Progress indicator.
- For one task's percent on its own. Use Progress ring.
- For substeps that can be done in any order inside one step. Split them into steps.
- To install or configure features in an org. The block only shows what the app reports.

## Usage

```tsx
import {
  SetupAssistant,
  SetupAssistantList,
  SetupAssistantSummary,
} from "@/components/wisty/setup-assistant"
```

```text
SetupAssistant
├── SetupAssistantSummary
└── SetupAssistantList
```

```tsx
<SetupAssistant steps={steps} aria-label="Sales Setup Assistant">
  <SetupAssistantList />
</SetupAssistant>
```

`SetupAssistantSummary` shows how many steps are done, as words and a bar. Put it in your card's header and `SetupAssistantList` in its body, with `SetupAssistant` around the card and `headingLevel={3}` under the card's `h2`. Leave the summary out for a list inside an existing section.

```tsx
<SetupAssistant
  steps={steps}
  aria-label="Sales Setup Assistant"
  onAction={(action, target) => openSetupFlow(action.value, target)}
  onToggleChange={(stepId, checked) => saveSetting(stepId, checked)}
>
  <SetupAssistantList />
</SetupAssistant>
```

A step is a `task` with a button or link, a `setting` with a switch, or a `sequence` of substeps. `onAction` and `onToggleChange` only ask for the work. Replace the step's progress, or the switch's `checked`, in `steps` once the work succeeds. A link never completes a step. For a sequence, `completed` counts finished substeps from the first: the next one is current, and later ones wait. `value`, `defaultValue` and `onValueChange` hold which sequences are open, apart from their progress.

## Rules

- Keep completion in `steps`, written by your app. Nothing in the block completes a step by itself.
- Pass an unknown progress with a label when you couldn't read it, never `not-started` or 0. For a setting, pass `checked: null` with an `unavailableLabel`, never `false`. Unknown never counts as done or not done.
- Pass `partial` with a message when only some steps could be read, and `steps={null}` when none could, never a shorter or empty list: an empty list says there are none.
- Pass `loading` while the steps load, never an empty list. To reload steps already shown, keep passing them with `loading`: the rows stay, and the summary says progress is updating instead of showing a bar that may be stale.
- Give every step a unique `id`, and every substep one unique within its step. Ids keep the open sequences and callbacks pointed at the right row when steps reorder.
- `estimatedTime` is a label. It never weighs progress, and the summary counts finished steps.
- Buttons render only with `onAction`, and switches only with `onToggleChange`. Without it, a setting shows its confirmed state as On or Off text.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `SetupAssistant` | [`<section>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section) | A setup checklist's data and expanded steps, shared by its summary and list. |
| `SetupAssistantSummary` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | How many steps are done, as words and a bar, or why that isn't known. |
| `SetupAssistantList` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | The numbered steps, with their rings, actions and substeps. |

### SetupAssistant

A setup checklist's data and expanded steps, shared by its summary and list.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label`? | `string` |  | Names the checklist, like "Sales Setup Assistant". |
| `aria-labelledby`? | `string` |  | The id of the visible title that names the checklist. |
| `steps` | `readonly SetupAssistantStep[] \| null` |  | The steps as read, in order. null when they couldn't be read. |
| `partial`? | `{ message: string } \| never` |  | Set when some steps couldn't be read: the notice above the ones that could. |
| `unavailableMessage`? | `never \| string` |  | Why the steps couldn't be read. Default "Setup steps aren't available." |
| `loading`? | `boolean` | `false` | Marks the checklist busy: placeholder rows with no steps, or the steps kept while they reload. |
| `value`? | `readonly string[]` |  | The ids of the open sequences, when controlled. |
| `defaultValue`? | `readonly string[]` |  | The ids of the sequences open at first. |
| `onValueChange`? | `(value: string[]) => void` |  | Called with the open sequences' ids, in step order. |
| `onAction`? | `( action: SetupAssistantButtonAction, target: SetupAssistantActionTarget ) => void` |  | Asks the app to do a button's work. Buttons render only with it. |
| `onToggleChange`? | `(stepId: string, checked: boolean) => void` |  | Asks the app to change a setting. Without it, settings show On or Off as text. |
| `headingLevel`? | `2 \| 3 \| 4 \| 5 \| 6` | `2` | The step titles' heading level. Default 2, 3 under a card's h2 title. |

### SetupAssistantSummary

How many steps are done, as words and a bar, or why that isn't known.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`? | `string` | `"Setup progress"` | Names the bar, shown above it. |

### SetupAssistantButtonAction

A button that asks the app to do a step's work, through onAction.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"button"` |  | Draws an outline brand button. |
| `value` | `string` |  | Identifies the action in onAction: "confirm-mapping". |
| `label` | `string` |  | The button's words: "Confirm mapping". |
| `disabled`? | `boolean` |  | Shows the button but doesn't let it run. |

### SetupAssistantLinkAction

A link to a setup page, an article or a video. Following it never completes a step.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"link"` |  | Navigates with href, without calling onAction. |
| `value` | `string` |  | Identifies the action: "manage-users". |
| `label` | `string` |  | The link's words: "View on Trailhead". |
| `href` | `string` |  | Where the link goes. |
| `variant`? | `"link" \| "outline-brand"` |  | "link" draws text, "outline-brand" a button that opens a setup page. Default "link". |
| `disabled`? | `boolean` |  | Shows the link as weak text, or a disabled button, that goes nowhere. |

### SetupAssistantToggle

A switch that turns a setting on or off, through onToggleChange.

```ts
type SetupAssistantToggle = {
  type: "toggle"
  value: string
  label: string
  disabled?: boolean
} & (
  | {
      checked: boolean
      unavailableLabel?: never
    }
  | {
      checked: null
      unavailableLabel: string
    }
)
```

### SetupAssistantControl

```ts
type SetupAssistantControl =
  | SetupAssistantButtonAction
  | SetupAssistantLinkAction
  | SetupAssistantToggle
```

### SetupAssistantActionTarget

What an action is for: a step, or one of a sequence's substeps.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `stepId` | `string` |  | The step's id. |
| `substepId`? | `string` |  | The substep's id, when the action is a substep's. |

### SetupAssistantTaskProgress

A task's progress. Unknown never counts as not started.

```ts
type SetupAssistantTaskProgress =
  | { value: "untracked" }
  | { value: "not-started"; label: string }
  | { value: "in-progress"; label: string; percent: number | null }
  | { value: "complete"; label: string }
  | { value: "unknown"; label: string }
```

### SetupAssistantSequenceProgress

A sequence's progress: how many substeps are done, counted from the first.

```ts
type SetupAssistantSequenceProgress =
  | { value: "known"; completed: number }
  | { value: "unknown"; label: string }
```

### SetupAssistantSubstep

One substep of a sequence. Substeps are done in order.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` |  | Unique within its sequence. |
| `label` | `string` |  | What to do: "Confirm field mapping". |
| `description`? | `string` |  | A line under the label. |
| `action`? | `SetupAssistantButtonAction \| SetupAssistantLinkAction` |  | A button or link for the substep. Later substeps' actions wait for earlier ones. |

### SetupAssistantTask

A step done in one go, with an optional button or link.

```ts
type SetupAssistantTask = SetupAssistantStepContent & {
  kind: "task"
  progress: SetupAssistantTaskProgress
  action?: SetupAssistantButtonAction | SetupAssistantLinkAction
}
```

### SetupAssistantSetting

A step that turns a setting on with a switch.

```ts
type SetupAssistantSetting = SetupAssistantStepContent & {
  kind: "setting"
  tracked: boolean
  action: SetupAssistantToggle
}
```

### SetupAssistantSequence

A step that expands into substeps done in order. Its ring counts them.

```ts
type SetupAssistantSequence = SetupAssistantStepContent & {
  kind: "sequence"
  progress: SetupAssistantSequenceProgress
  substeps: readonly [SetupAssistantSubstep, ...SetupAssistantSubstep[]]
}
```

### SetupAssistantStep

```ts
type SetupAssistantStep =
  | SetupAssistantTask
  | SetupAssistantSetting
  | SetupAssistantSequence
```

### SetupAssistantRead

The steps as read: a list, partial when some couldn't be read, or null when none could.

```ts
type SetupAssistantRead =
  | {
      steps: readonly SetupAssistantStep[]
      partial?: { message: string }
      unavailableMessage?: never
    }
  | {
      steps: null
      partial?: never
      unavailableMessage?: string
    }
```

## Accessibility

- Each step's title is a heading at `headingLevel`, 2 by default. Set it one below the heading the list sits under.
- A sequence opens from its chevron and from its title. Both report `aria-expanded` and point at the substeps with `aria-controls`.
- Each ring is named "Step 2: Prepare your account data" and described by the step's progress label. Unknown progress shows its label on the page, and a setting that couldn't be read shows its `unavailableLabel` in place of the switch.
- A switch is named by its toggle's `label`. The On and Off beside it are hidden from screen readers, which hear the switch's state. Without `onToggleChange` there's no switch, and screen readers hear the label before the On or Off text.
- A link with `disabled`, or a later substep's link, is plain text with no `href`, so it takes no focus. With the button look it's a disabled button.
- If your app closes an open sequence while focus is inside it, move focus to its title first.

## Responsive behavior

- The block takes its container's width. Below 32rem, a step's action and estimate move under its description.
- Titles, descriptions and substeps wrap instead of truncating. Give the card a `max-w-*` so lines stay readable on a wide page.

## Example code

### Sales Setup Assistant

Confirming account data advances its substeps, the switch completes its step, and the header counts finished steps.

```tsx
"use client"

import { useId, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SetupAssistant,
  SetupAssistantList,
  SetupAssistantSummary,
  type SetupAssistantButtonAction,
  type SetupAssistantStep,
} from "@/components/wisty/setup-assistant"
import { salesSetupSteps } from "@/components/wisty/setup-assistant-data"

function confirm(
  step: SetupAssistantStep,
  action: SetupAssistantButtonAction,
  substepId?: string
): SetupAssistantStep {
  if (step.kind === "task")
    return action.value === "review-assignment"
      ? { ...step, progress: { value: "complete", label: "Complete" } }
      : step
  if (step.kind !== "sequence" || step.progress.value !== "known") return step
  const next = step.substeps[step.progress.completed]
  if (next?.id !== substepId) return step
  return {
    ...step,
    progress: { value: "known", completed: step.progress.completed + 1 },
  }
}

export default function SetupAssistantDefault() {
  const titleId = useId()
  const [steps, setSteps] =
    useState<readonly SetupAssistantStep[]>(salesSetupSteps)

  const update = (
    stepId: string,
    change: (step: SetupAssistantStep) => SetupAssistantStep
  ) =>
    setSteps((current) =>
      current.map((step) => (step.id === stepId ? change(step) : step))
    )

  return (
    <SetupAssistant
      steps={steps}
      aria-labelledby={titleId}
      headingLevel={3}
      defaultValue={["account-data"]}
      onAction={(action, target) =>
        update(target.stepId, (step) => confirm(step, action, target.substepId))
      }
      onToggleChange={(stepId, checked) =>
        update(stepId, (step) =>
          step.kind === "setting"
            ? {
                ...step,
                action: {
                  type: "toggle",
                  value: step.action.value,
                  label: step.action.label,
                  checked,
                },
              }
            : step
        )
      }
      className="w-full max-w-3xl"
    >
      <Card className="gap-0 py-0">
        <CardHeader className="mb-3 gap-3 bg-muted p-4">
          <CardTitle>
            <h2 id={titleId}>Sales Setup Assistant</h2>
          </CardTitle>
          <SetupAssistantSummary label="Complete all the steps below to finish setting up Sales Cloud." />
        </CardHeader>
        <CardContent className="px-0">
          <SetupAssistantList />
        </CardContent>
      </Card>
    </SetupAssistant>
  )
}
```

It imports this file, which installing Setup assistant writes too.

#### components/wisty/setup-assistant-data.ts

```ts
import type { SetupAssistantStep } from "@/components/wisty/setup-assistant"

export const salesSetupSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Ellen Hart and Priya Raman can sign in to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "complete", label: "Complete" },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: { value: "known", completed: 1 },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        description:
          "Check Edge Communications and Burlington Textiles for duplicates.",
        action: {
          type: "button",
          value: "confirm-source",
          label: "Confirm Source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        description: "Match Account Name, Billing Address and Account Owner.",
        action: {
          type: "button",
          value: "confirm-mapping",
          label: "Confirm Mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        description: "Check the sample before the remaining accounts import.",
        action: {
          type: "button",
          value: "approve-sample",
          label: "Approve Sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: false,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "not-started", label: "Not started" },
    action: {
      type: "button",
      value: "review-assignment",
      label: "Mark Reviewed",
    },
  },
] satisfies SetupAssistantStep[]

export const salesSetupPartialMessage =
  "Some setup steps couldn't be read. Showing the steps that could."

export const salesSetupPartialSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Give each sales rep access to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "unknown", label: "Team access couldn't be checked." },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: {
      value: "unknown",
      label: "Account preparation progress is unavailable.",
    },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        action: {
          type: "link",
          value: "review-source",
          label: "Review Source",
          href: "/setup/import/source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        action: {
          type: "link",
          value: "review-mapping",
          label: "Review Mapping",
          href: "/setup/import/mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        action: {
          type: "link",
          value: "review-sample",
          label: "Review Sample",
          href: "/setup/import/sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: true,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "complete", label: "Complete" },
  },
] satisfies SetupAssistantStep[]

export const serviceSetupSteps = [
  {
    kind: "task",
    id: "email-to-case",
    title: "Set up Email-to-Case",
    description: "Turn customer emails to your support address into cases.",
    estimatedTime: "15 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "email-to-case",
      label: "Open Email-to-Case",
      href: "/setup/email-to-case",
      variant: "outline-brand",
    },
  },
  {
    kind: "task",
    id: "knowledge",
    title: "Learn how agents use Knowledge",
    description: "See how articles help agents answer common questions.",
    estimatedTime: "20 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "knowledge-guide",
      label: "Read the Guide",
      href: "/help/knowledge",
    },
  },
  {
    kind: "setting",
    id: "case-feed",
    title: "Turn on Feed Tracking for cases",
    description: "Show changes to a case's status and owner in its feed.",
    tracked: false,
    action: {
      type: "toggle",
      value: "case-feed-tracking",
      label: "Turn on Feed Tracking for cases",
      checked: true,
    },
  },
] satisfies SetupAssistantStep[]
```

### Steps without progress

Untracked steps with no rings, a setup page, a guide and a switch, without a card or summary.

```tsx
"use client"

import { useState } from "react"

import {
  SetupAssistant,
  SetupAssistantList,
  type SetupAssistantStep,
} from "@/components/wisty/setup-assistant"
import { serviceSetupSteps } from "@/components/wisty/setup-assistant-data"

export default function SetupAssistantListExample() {
  const [steps, setSteps] =
    useState<readonly SetupAssistantStep[]>(serviceSetupSteps)

  return (
    <SetupAssistant
      steps={steps}
      aria-label="Service setup"
      onToggleChange={(stepId, checked) =>
        setSteps((current) =>
          current.map((step) =>
            step.id === stepId && step.kind === "setting"
              ? {
                  ...step,
                  action: {
                    type: "toggle",
                    value: step.action.value,
                    label: step.action.label,
                    checked,
                  },
                }
              : step
          )
        )
      }
      className="w-full max-w-3xl"
    >
      <SetupAssistantList />
    </SetupAssistant>
  )
}
```

It imports this file, which installing Setup assistant writes too.

#### components/wisty/setup-assistant-data.ts

```ts
import type { SetupAssistantStep } from "@/components/wisty/setup-assistant"

export const salesSetupSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Ellen Hart and Priya Raman can sign in to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "complete", label: "Complete" },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: { value: "known", completed: 1 },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        description:
          "Check Edge Communications and Burlington Textiles for duplicates.",
        action: {
          type: "button",
          value: "confirm-source",
          label: "Confirm Source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        description: "Match Account Name, Billing Address and Account Owner.",
        action: {
          type: "button",
          value: "confirm-mapping",
          label: "Confirm Mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        description: "Check the sample before the remaining accounts import.",
        action: {
          type: "button",
          value: "approve-sample",
          label: "Approve Sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: false,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "not-started", label: "Not started" },
    action: {
      type: "button",
      value: "review-assignment",
      label: "Mark Reviewed",
    },
  },
] satisfies SetupAssistantStep[]

export const salesSetupPartialMessage =
  "Some setup steps couldn't be read. Showing the steps that could."

export const salesSetupPartialSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Give each sales rep access to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "unknown", label: "Team access couldn't be checked." },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: {
      value: "unknown",
      label: "Account preparation progress is unavailable.",
    },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        action: {
          type: "link",
          value: "review-source",
          label: "Review Source",
          href: "/setup/import/source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        action: {
          type: "link",
          value: "review-mapping",
          label: "Review Mapping",
          href: "/setup/import/mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        action: {
          type: "link",
          value: "review-sample",
          label: "Review Sample",
          href: "/setup/import/sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: true,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "complete", label: "Complete" },
  },
] satisfies SetupAssistantStep[]

export const serviceSetupSteps = [
  {
    kind: "task",
    id: "email-to-case",
    title: "Set up Email-to-Case",
    description: "Turn customer emails to your support address into cases.",
    estimatedTime: "15 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "email-to-case",
      label: "Open Email-to-Case",
      href: "/setup/email-to-case",
      variant: "outline-brand",
    },
  },
  {
    kind: "task",
    id: "knowledge",
    title: "Learn how agents use Knowledge",
    description: "See how articles help agents answer common questions.",
    estimatedTime: "20 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "knowledge-guide",
      label: "Read the Guide",
      href: "/help/knowledge",
    },
  },
  {
    kind: "setting",
    id: "case-feed",
    title: "Turn on Feed Tracking for cases",
    description: "Show changes to a case's status and owner in its feed.",
    tracked: false,
    action: {
      type: "toggle",
      value: "case-feed-tracking",
      label: "Turn on Feed Tracking for cases",
      checked: true,
    },
  },
] satisfies SetupAssistantStep[]
```

### Progress not fully available

Available steps stay visible, unknown progress is named, a setting with no handler reads On as text, and no overall percentage is guessed.

```tsx
import { useId } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SetupAssistant,
  SetupAssistantList,
  SetupAssistantSummary,
} from "@/components/wisty/setup-assistant"
import {
  salesSetupPartialMessage,
  salesSetupPartialSteps,
} from "@/components/wisty/setup-assistant-data"

export default function SetupAssistantPartial() {
  const titleId = useId()

  return (
    <SetupAssistant
      steps={salesSetupPartialSteps}
      partial={{ message: salesSetupPartialMessage }}
      aria-labelledby={titleId}
      headingLevel={3}
      defaultValue={["account-data"]}
      className="w-full max-w-3xl"
    >
      <Card className="gap-0 py-0">
        <CardHeader className="mb-3 gap-3 bg-muted p-4">
          <CardTitle>
            <h2 id={titleId}>Sales Setup Assistant</h2>
          </CardTitle>
          <SetupAssistantSummary />
        </CardHeader>
        <CardContent className="px-0">
          <SetupAssistantList />
        </CardContent>
      </Card>
    </SetupAssistant>
  )
}
```

It imports this file, which installing Setup assistant writes too.

#### components/wisty/setup-assistant-data.ts

```ts
import type { SetupAssistantStep } from "@/components/wisty/setup-assistant"

export const salesSetupSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Ellen Hart and Priya Raman can sign in to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "complete", label: "Complete" },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: { value: "known", completed: 1 },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        description:
          "Check Edge Communications and Burlington Textiles for duplicates.",
        action: {
          type: "button",
          value: "confirm-source",
          label: "Confirm Source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        description: "Match Account Name, Billing Address and Account Owner.",
        action: {
          type: "button",
          value: "confirm-mapping",
          label: "Confirm Mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        description: "Check the sample before the remaining accounts import.",
        action: {
          type: "button",
          value: "approve-sample",
          label: "Approve Sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: false,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "not-started", label: "Not started" },
    action: {
      type: "button",
      value: "review-assignment",
      label: "Mark Reviewed",
    },
  },
] satisfies SetupAssistantStep[]

export const salesSetupPartialMessage =
  "Some setup steps couldn't be read. Showing the steps that could."

export const salesSetupPartialSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Give each sales rep access to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "unknown", label: "Team access couldn't be checked." },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: {
      value: "unknown",
      label: "Account preparation progress is unavailable.",
    },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        action: {
          type: "link",
          value: "review-source",
          label: "Review Source",
          href: "/setup/import/source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        action: {
          type: "link",
          value: "review-mapping",
          label: "Review Mapping",
          href: "/setup/import/mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        action: {
          type: "link",
          value: "review-sample",
          label: "Review Sample",
          href: "/setup/import/sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: true,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "complete", label: "Complete" },
  },
] satisfies SetupAssistantStep[]

export const serviceSetupSteps = [
  {
    kind: "task",
    id: "email-to-case",
    title: "Set up Email-to-Case",
    description: "Turn customer emails to your support address into cases.",
    estimatedTime: "15 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "email-to-case",
      label: "Open Email-to-Case",
      href: "/setup/email-to-case",
      variant: "outline-brand",
    },
  },
  {
    kind: "task",
    id: "knowledge",
    title: "Learn how agents use Knowledge",
    description: "See how articles help agents answer common questions.",
    estimatedTime: "20 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "knowledge-guide",
      label: "Read the Guide",
      href: "/help/knowledge",
    },
  },
  {
    kind: "setting",
    id: "case-feed",
    title: "Turn on Feed Tracking for cases",
    description: "Show changes to a case's status and owner in its feed.",
    tracked: false,
    action: {
      type: "toggle",
      value: "case-feed-tracking",
      label: "Turn on Feed Tracking for cases",
      checked: true,
    },
  },
] satisfies SetupAssistantStep[]
```

### No setup steps

A complete empty checklist says there are no steps to show, without claiming setup is finished.

```tsx
import { useId } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SetupAssistant,
  SetupAssistantList,
  SetupAssistantSummary,
} from "@/components/wisty/setup-assistant"

export default function SetupAssistantEmpty() {
  const titleId = useId()

  return (
    <SetupAssistant
      steps={[]}
      aria-labelledby={titleId}
      headingLevel={3}
      className="w-full max-w-3xl"
    >
      <Card className="gap-0 py-0">
        <CardHeader className="mb-3 gap-3 bg-muted p-4">
          <CardTitle>
            <h2 id={titleId}>Sales Setup Assistant</h2>
          </CardTitle>
          <SetupAssistantSummary />
        </CardHeader>
        <CardContent className="px-0">
          <SetupAssistantList />
        </CardContent>
      </Card>
    </SetupAssistant>
  )
}
```

### Setup unavailable

An unavailable checklist explains what couldn't be read instead of showing an empty list.

```tsx
import { useId } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SetupAssistant,
  SetupAssistantList,
  SetupAssistantSummary,
} from "@/components/wisty/setup-assistant"

export default function SetupAssistantUnavailable() {
  const titleId = useId()

  return (
    <SetupAssistant
      steps={null}
      unavailableMessage="Setup steps couldn't be loaded. Try again in a few minutes."
      aria-labelledby={titleId}
      headingLevel={3}
      className="w-full max-w-3xl"
    >
      <Card className="gap-0 py-0">
        <CardHeader className="mb-3 gap-3 bg-muted p-4">
          <CardTitle>
            <h2 id={titleId}>Sales Setup Assistant</h2>
          </CardTitle>
          <SetupAssistantSummary />
        </CardHeader>
        <CardContent className="px-0">
          <SetupAssistantList />
        </CardContent>
      </Card>
    </SetupAssistant>
  )
}
```

### Loading setup

Placeholder rows hold the list's shape while setup loads, without an invented completion value.

```tsx
import { useId } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SetupAssistant,
  SetupAssistantList,
  SetupAssistantSummary,
} from "@/components/wisty/setup-assistant"

export default function SetupAssistantLoading() {
  const titleId = useId()

  return (
    <SetupAssistant
      steps={null}
      loading
      aria-labelledby={titleId}
      headingLevel={3}
      className="w-full max-w-3xl"
    >
      <Card className="gap-0 py-0">
        <CardHeader className="mb-3 gap-3 bg-muted p-4">
          <CardTitle>
            <h2 id={titleId}>Sales Setup Assistant</h2>
          </CardTitle>
          <SetupAssistantSummary />
        </CardHeader>
        <CardContent className="px-0">
          <SetupAssistantList />
        </CardContent>
      </Card>
    </SetupAssistant>
  )
}
```
