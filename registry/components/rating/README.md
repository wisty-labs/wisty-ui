# Rating

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/rating](https://ui.wisty.ai/rating) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks a score from a row of stars or other icons that fill up to the choice. To show a score, use Gauge.

```bash
npx shadcn@latest add @wisty/rating
```

## Examples

- `default` (Support satisfaction): A survey question with five stars, four chosen, and Bad and Good under the two ends from `RatingLabels`.
- `icons` (Icons): Hearts, and three thumbs up with a `max` of 3, each set with `icon`.
- `clear` (Clearing a score): A controlled `value` and a Clear button that sets it to `null`, since choosing the same icon again keeps the score.
- `states` (States): A `required` question showing its error until a score is chosen, and a `disabled` rating with its score kept.

## When to use

- People give a score out of a few points by picking an icon, like a star rating for a support case, an article or a survey question.
- The score reads best as stars, hearts or thumbs up filling from the left, with words like Bad and Good under the two ends.
- A feedback form or a customer satisfaction (CSAT) question in a survey.

## When not to use

- To show a score someone already gave, like an average rating. Use Gauge with `variant="rating"`.
- For a 0 to 10 scale or a row of numbers, like Net Promoter Score. Use Linear scale.
- For a few named answers, like Yes, No and Not sure. Use Radio group.
- For a value along a long range, like a percentage. Use Slider.

## Usage

```tsx
import { Rating, RatingLabel, RatingLabels } from "@/components/wisty/rating"
```

```text
Rating
└── RatingLabels
    ├── RatingLabel
    └── RatingLabel
```

```tsx
<Rating name="article" aria-label="Rate this article">
  <RatingLabels>
    <RatingLabel>Bad</RatingLabel>
    <RatingLabel>Good</RatingLabel>
  </RatingLabels>
</Rating>
```

`Rating` draws `max` icons, five by default, and the score is the string `"1"` to `max`. The first `RatingLabel` sits under the first icon and the last under the last icon. Leave out `RatingLabels` for a rating with no words under it.

Choosing the same icon again keeps the score. To clear it, control `value` and set it to `null`, as the Clearing a score example does. For an error, set `aria-invalid` on `Rating`, which marks the group, and point `aria-describedby` at the `FieldError`. With `required`, the radios are also invalid to the browser until a score is chosen.

## Rules

- Keep the icons in one `Rating`: the group holds the score, the name and the keyboard.
- Use an icon whose outline fills to a solid shape, like `StarIcon`, `HeartIcon` or `ThumbsUpIcon`. An icon with lines inside a closed outline, like a face, fills to a plain disc.
- Put at most two `RatingLabel`s in `RatingLabels`, one for each end.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `Rating` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | A score from 1 to max, picked from a row of icons that fill up to the chosen one. |
| `RatingLabels` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |
| `RatingLabel` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |  |

### Rating

A score from 1 to max, picked from a row of icons that fill up to the chosen one.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value`? | `string \| null` |  | The chosen score, "1" to `max`, controlled. `null` for none. |
| `defaultValue`? | `string` |  | The score chosen at first, when uncontrolled. |
| `onValueChange`? | `(value: string) => void` |  | Called with the chosen score when someone picks an icon. |
| `max`? | `number` | `5` | How many icons, and the highest score. A whole number of 1 or more. |
| `icon`? | `LucideIcon` | `StarIcon` | The icon to repeat, from lucide-react. |
| `name`? | `string` |  | The inputs' name, to submit the score with a form. Generated when not given. |
| `disabled`? | `boolean` | `false` | Disables every icon. |
| `required`? | `boolean` | `false` | A score must be chosen before the form submits. |
| `form`? | `string` |  | The id of a form the inputs belong to, outside it. |

## SLDS mapping

`Rating` is a `div` with `role="radiogroup"`, the group SLDS leaves to the fieldset around it. Each icon is a visually hidden native radio (`slds-assistive-text`) and a `label` holding the icon, as a Salesforce survey's rating question draws it. `RatingLabels` and `RatingLabel` are the words a survey shows under the ends.

Known gaps:

- SLDS 2 has no rating component, so the colors come from its hooks: the accent fill of a chosen icon, the icon color at rest and the disabled color.
- Icons are lucide's, stroked outlines that fill when chosen, where a survey draws Salesforce's own icons.
- No smiley icon set: a face's eyes and mouth disappear when it fills. Use stars, hearts or thumbs up.

## Keyboard interactions

| Key                       | Action                                                           |
| ------------------------- | ---------------------------------------------------------------- |
| Tab                       | Moves focus to the chosen icon, or the first icon with no score. |
| Arrow Right or Arrow Down | Chooses the next icon.                                           |
| Arrow Left or Arrow Up    | Chooses the previous icon.                                       |
| Space                     | Chooses the focused icon when none is chosen.                    |

## Accessibility

- Name the group with `aria-labelledby` pointing at a `FieldLegend`, or with `aria-label`.
- Each icon is named "3 of 5", in English. The icons themselves are hidden from screen readers.
- `RatingLabels` describes the group, after any `aria-describedby` you pass, so a screen reader hears what the ends mean.

## Motion

- Choosing a score fades the icons up to it in, and the ones after it out, over 300ms. Reduced motion keeps the fade, since only the color changes.
- Hovering an icon doesn't fill anything. Pressing one fills it while the pointer is down.

## Example code

### Support satisfaction

A survey question with five stars, four chosen, and Bad and Good under the two ends from `RatingLabels`.

```tsx
import { useId } from "react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { Rating, RatingLabel, RatingLabels } from "@/components/wisty/rating"

export default function RatingDefault() {
  const id = useId()

  return (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label" id={`${id}-legend`}>
        How satisfied are you with the support you received?
      </FieldLegend>
      <Rating
        name="satisfaction"
        defaultValue="4"
        aria-labelledby={`${id}-legend`}
      >
        <RatingLabels>
          <RatingLabel>Bad</RatingLabel>
          <RatingLabel>Good</RatingLabel>
        </RatingLabels>
      </Rating>
    </FieldSet>
  )
}
```

### Icons

Hearts, and three thumbs up with a `max` of 3, each set with `icon`.

```tsx
import { useId } from "react"
import { HeartIcon, ThumbsUpIcon } from "lucide-react"

import { FieldLegend, FieldSet } from "@/components/ui/field"
import { Rating } from "@/components/wisty/rating"

export default function RatingIcons() {
  const id = useId()

  return (
    <div className="flex max-w-sm flex-col gap-6">
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-article`}>
          How much did you like this article?
        </FieldLegend>
        <Rating
          name="article"
          icon={HeartIcon}
          defaultValue="5"
          aria-labelledby={`${id}-article`}
        />
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-answer`}>
          How helpful was the answer?
        </FieldLegend>
        <Rating
          name="answer"
          icon={ThumbsUpIcon}
          max={3}
          defaultValue="2"
          aria-labelledby={`${id}-answer`}
        />
      </FieldSet>
    </div>
  )
}
```

### Clearing a score

A controlled `value` and a Clear button that sets it to `null`, since choosing the same icon again keeps the score.

```tsx
"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { Rating } from "@/components/wisty/rating"

export default function RatingClear() {
  const id = useId()
  const [score, setScore] = useState<string | null>("3")

  return (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label" id={`${id}-legend`}>
        Rate the onboarding call
      </FieldLegend>
      <div className="flex items-center gap-4">
        <Rating
          name="onboarding"
          value={score}
          onValueChange={setScore}
          aria-labelledby={`${id}-legend`}
        />
        <Button
          variant="outline"
          disabled={score === null}
          onClick={() => setScore(null)}
        >
          Clear
        </Button>
      </div>
    </FieldSet>
  )
}
```

### States

A `required` question showing its error until a score is chosen, and a `disabled` rating with its score kept.

```tsx
"use client"

import { useId, useState } from "react"

import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field"
import { Rating, RatingLabel, RatingLabels } from "@/components/wisty/rating"

export default function RatingStates() {
  const id = useId()
  const [score, setScore] = useState<string | null>(null)
  const invalid = score === null

  return (
    <div className="flex max-w-sm flex-col gap-6">
      <FieldSet data-invalid={invalid}>
        <FieldLegend variant="label" id={`${id}-resolution`}>
          <abbr
            title="required"
            className="me-0.5 text-destructive no-underline"
          >
            *
          </abbr>
          How well did we resolve your case?
        </FieldLegend>
        <Rating
          name="resolution"
          required
          value={score}
          onValueChange={setScore}
          aria-invalid={invalid}
          aria-labelledby={`${id}-resolution`}
          aria-describedby={invalid ? `${id}-resolution-error` : undefined}
        >
          <RatingLabels>
            <RatingLabel>Not at all</RatingLabel>
            <RatingLabel>Completely</RatingLabel>
          </RatingLabels>
        </Rating>
        {invalid ? (
          <FieldError id={`${id}-resolution-error`}>
            Complete this field.
          </FieldError>
        ) : null}
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label" id={`${id}-previous`}>
          Your previous rating
        </FieldLegend>
        <Rating
          name="previous"
          defaultValue="2"
          disabled
          aria-labelledby={`${id}-previous`}
        />
      </FieldSet>
    </div>
  )
}
```
