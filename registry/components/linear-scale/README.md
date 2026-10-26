# Linear scale

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/linear-scale](https://ui.wisty.ai/linear-scale) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks one number from a row, like 0 to 10, with words under the two ends. For stars or hearts, use Rating.

```bash
npx shadcn@latest add @wisty/linear-scale
```

## Examples

- `default` (Likelihood to recommend): A 0 to 10 question with its two ends labelled, 8 chosen, as a Net Promoter Score survey asks it.
- `nps` (Score bands): The same question with `bands`: 0 to 6 in the error color, 7 and 8 in the warning color, 9 and 10 in the success color.
- `csat` (One to five): A satisfaction question from 1 to 5, set with `min` and `max`.
- `states` (States): A required question showing its error until a number is chosen, and a `disabled` scale with its answer and bands.

## When to use

- People answer a survey question with one number on a scale, like a Net Promoter Score from 0 to 10 or a satisfaction score from 1 to 5.
- Every number should stay in view, with words under the two ends that say what they mean, like "Not at all likely" and "Extremely likely".
- Ranges of the scale mean something, like detractors, passives and promoters. Color them with `bands`.

## When not to use

- People rate something with stars, hearts or thumbs. Use Rating.
- The options are words, not numbers. Use Radio group, or Toggle group for a segmented control in a toolbar.
- The value is any number in a wide range, like a discount. Use Slider or a number input.
- The score is shown, not entered. Use Gauge.

## Usage

```tsx
import {
  LinearScale,
  LinearScaleLabel,
  LinearScaleLabels,
} from "@/components/wisty/linear-scale"
```

```text
LinearScale
└── LinearScaleLabels
    └── LinearScaleLabel
```

`LinearScale` draws one number for every whole number from `min` to `max` (0 to 10 by default). Put the end labels inside it: the first `LinearScaleLabel` sits under the first number and the last under the last number. Leave `LinearScaleLabels` out for a scale without words.

```tsx
<LinearScale min={1} max={5} aria-labelledby="csat-legend">
  <LinearScaleLabels>
    <LinearScaleLabel>Very dissatisfied</LinearScaleLabel>
    <LinearScaleLabel>Very satisfied</LinearScaleLabel>
  </LinearScaleLabels>
</LinearScale>
```

The value is the chosen number as a string, like `"9"`, and the same string submits with a form under `name`. Choosing the chosen number again keeps it. To clear the answer, control `value` and set it to `null`, as Rating's Clear example does.

Each band is `{ from, to, tone }`, both ends included, with `tone` one of `"error"`, `"warning"` or `"success"`:

```tsx
<LinearScale
  bands={[
    { from: 0, to: 6, tone: "error" },
    { from: 7, to: 8, tone: "warning" },
    { from: 9, to: 10, tone: "success" },
  ]}
/>
```

## Rules

- `min`, `max` and every band's ends are whole numbers, and bands stay inside the range without overlapping. Anything else throws.
- Keep the end labels short. Each one wraps within half the scale's width.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `LinearScale` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | A row of whole numbers to choose one from, like a 0 to 10 likelihood score. |
| `LinearScaleLabels` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |
| `LinearScaleLabel` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |  |

### LinearScale

A row of whole numbers to choose one from, like a 0 to 10 likelihood score.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `min`? | `number` | `0` | The first number on the scale, a whole number. |
| `max`? | `number` | `10` | The last number on the scale, a whole number, no lower than `min`. |
| `bands`? | `readonly LinearScaleBand[]` | `[]` | Colored ranges of numbers. Numbers outside every band keep the plain look. |
| `value`? | `string \| null` |  | The chosen number as a string, controlled. `null` for none. |
| `defaultValue`? | `string` |  | The number chosen at first, uncontrolled. |
| `onValueChange`? | `(value: string) => void` |  | Called with the chosen number as a string. |
| `name`? | `string` |  | The radios' name, to submit the choice with a form. Generated when not given. |
| `disabled`? | `boolean` | `false` | Disables every number. |
| `required`? | `boolean` | `false` | A number must be chosen before the form submits. |
| `form`? | `string` |  | The id of a form the radios belong to, outside it. |

### LinearScaleBand

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `from` | `number` |  | The band's first number, included. |
| `to` | `number` |  | The band's last number, included. |
| `tone` | `LinearScaleTone` |  | The band's color, as a strip over each of its numbers. |

## SLDS mapping

`LinearScale` is `slds-radio_button-group`, and each number is an `slds-radio_button`: a native radio, visually hidden, and its `slds-radio_button__label`. The end labels and the band strips have no SLDS class.

Known gaps:

- The numbers have narrower padding than SLDS's radio buttons, so 0 to 10 fits a form column.
- SLDS has no rating scale or band. The strip over a banded number is drawn with the error, warning and success colors.

## Accessibility

- Name the scale with `aria-labelledby` pointing at a `FieldLegend`, or with `aria-label`. Each radio is named by its number.
- The numbers are one Tab stop. Tab enters at the chosen number, or the first one when none is chosen, and the arrow keys move the choice.
- The end labels become the scale's description, after any `aria-describedby` you pass, so a screen reader reads what the ends mean when focus enters the scale.
- For an error, set `aria-invalid` on `LinearScale`, which marks the group, and point `aria-describedby` at the `FieldError`. With `required`, the radios are also invalid to the browser until a number is chosen.
- A band's color is a hint, not the answer. The number carries the meaning, so the bands need no text of their own.

## Responsive behavior

- The numbers keep their width and never wrap. When the row is wider than its container, the scale scrolls sideways, and focusing a number scrolls it into view.
- The scale takes the width of its container. Inside a container that sizes to its content, give that container a width, like `w-full max-w-md` on the `FieldSet`.

## Example code

### Likelihood to recommend

A 0 to 10 question with its two ends labelled, 8 chosen, as a Net Promoter Score survey asks it.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  LinearScale,
  LinearScaleLabel,
  LinearScaleLabels,
} from "@/components/wisty/linear-scale"

export default function LinearScaleDefault() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label" id={`${id}-legend`}>
        How likely are you to recommend us to a colleague?
      </FieldLegend>
      <LinearScale
        name="recommend"
        defaultValue="8"
        aria-labelledby={`${id}-legend`}
      >
        <LinearScaleLabels>
          <LinearScaleLabel>Not at all likely</LinearScaleLabel>
          <LinearScaleLabel>Extremely likely</LinearScaleLabel>
        </LinearScaleLabels>
      </LinearScale>
    </FieldSet>
  )
}
```

### Score bands

The same question with `bands`: 0 to 6 in the error color, 7 and 8 in the warning color, 9 and 10 in the success color.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  LinearScale,
  LinearScaleLabel,
  LinearScaleLabels,
} from "@/components/wisty/linear-scale"

export default function LinearScaleNps() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label" id={`${id}-legend`}>
        How likely are you to recommend us to a colleague?
      </FieldLegend>
      <LinearScale
        name="nps"
        defaultValue="9"
        bands={[
          { from: 0, to: 6, tone: "error" },
          { from: 7, to: 8, tone: "warning" },
          { from: 9, to: 10, tone: "success" },
        ]}
        aria-labelledby={`${id}-legend`}
      >
        <LinearScaleLabels>
          <LinearScaleLabel>Not at all likely</LinearScaleLabel>
          <LinearScaleLabel>Extremely likely</LinearScaleLabel>
        </LinearScaleLabels>
      </LinearScale>
    </FieldSet>
  )
}
```

### One to five

A satisfaction question from 1 to 5, set with `min` and `max`.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import {
  LinearScale,
  LinearScaleLabel,
  LinearScaleLabels,
} from "@/components/wisty/linear-scale"

export default function LinearScaleCsat() {
  const id = useId()

  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend variant="label" id={`${id}-legend`}>
        How satisfied are you with the support you received?
      </FieldLegend>
      <LinearScale
        name="csat"
        min={1}
        max={5}
        defaultValue="4"
        aria-labelledby={`${id}-legend`}
      >
        <LinearScaleLabels>
          <LinearScaleLabel>Very dissatisfied</LinearScaleLabel>
          <LinearScaleLabel>Very satisfied</LinearScaleLabel>
        </LinearScaleLabels>
      </LinearScale>
    </FieldSet>
  )
}
```

### States

A required question showing its error until a number is chosen, and a `disabled` scale with its answer and bands.

```tsx
"use client"

import { useId, useState } from "react"

import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  LinearScale,
  LinearScaleLabel,
  LinearScaleLabels,
} from "@/components/wisty/linear-scale"

export default function LinearScaleStates() {
  const id = useId()
  const [effort, setEffort] = useState<string | null>(null)
  const invalid = effort === null

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <FieldSet data-invalid={invalid}>
        <FieldLegend variant="label" id={`${id}-effort`}>
          <abbr
            title="required"
            className="me-0.5 text-destructive no-underline"
          >
            *
          </abbr>
          How easy was it to get your issue resolved?
        </FieldLegend>
        <LinearScale
          name="effort"
          min={1}
          max={5}
          required
          value={effort}
          onValueChange={setEffort}
          aria-invalid={invalid}
          aria-labelledby={`${id}-effort`}
          aria-describedby={invalid ? `${id}-effort-error` : undefined}
        >
          <LinearScaleLabels>
            <LinearScaleLabel>Very difficult</LinearScaleLabel>
            <LinearScaleLabel>Very easy</LinearScaleLabel>
          </LinearScaleLabels>
        </LinearScale>
        {invalid ? (
          <FieldError id={`${id}-effort-error`}>
            Complete this field.
          </FieldError>
        ) : null}
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-recommend`}>
          How likely are you to recommend us to a colleague?
        </FieldLegend>
        <LinearScale
          name="recommend"
          defaultValue="7"
          disabled
          bands={[
            { from: 0, to: 6, tone: "error" },
            { from: 7, to: 8, tone: "warning" },
            { from: 9, to: 10, tone: "success" },
          ]}
          aria-labelledby={`${id}-recommend`}
        >
          <LinearScaleLabels>
            <LinearScaleLabel>Not at all likely</LinearScaleLabel>
            <LinearScaleLabel>Extremely likely</LinearScaleLabel>
          </LinearScaleLabels>
        </LinearScale>
      </FieldSet>
    </div>
  )
}
```
