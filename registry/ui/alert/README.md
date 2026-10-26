# Alert

This page shows the Radix version. Base UI projects get [registry/base/ui/alert.tsx](../../base/ui/alert.tsx), and [ui.wisty.ai/alert](https://ui.wisty.ai/alert) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Tells people about part of the page, with an icon, a title and an action. Also the page-wide banner.

```bash
npx shadcn@latest add @wisty/alert
```

## Examples

- `default` (Possible duplicates): The default notification on a lead record: an icon, an `AlertTitle`, and a link to the duplicates in `AlertDescription`.
- `variants` (Variants): The error, warning, success and info colors, set with `variant`, where errors are `destructive`.
- `banner` (Banner): The page-wide alert from `variant="banner"`, with a link and a close button in `AlertAction`.

## When to use

- A message is about one part of a page, like a record, a card or a form section, and should stay in view.
- Something needs attention before people go on: an error, a warning or missing data.
- The whole app or page has a status that lasts, like a sandbox or a lost connection. Use `variant="banner"`.

## When not to use

- The message confirms an action people just took, like a save. Use Sonner: a success message belongs in a toast, not a notification that stays.
- The message is about one field. Use the field's error text in Field.
- People must decide something before they go on. Use Alert Dialog.
- You need a short status label, like "Active". Use Badge.

## Usage

```tsx
import { TriangleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

```text
Alert
├── icon (optional)
├── AlertTitle (optional)
├── AlertDescription
└── AlertAction (optional button)
```

```tsx
<Alert variant="warning">
  <TriangleAlertIcon />
  <AlertTitle>No price book</AlertTitle>
  <AlertDescription>Add one before you create quotes.</AlertDescription>
</Alert>
```

A banner for the top of a page takes a close button in an `AlertAction`, as the Banner example shows. It has the info colors. For a warning or error banner, pass the state's color pair:

```tsx
<Alert variant="banner" className="bg-warning-container text-on-warning">
```

Errors take `bg-error-container text-on-error`. Both pairs change with the theme.

## Rules

- Pick the variant by meaning: `default` for neutral notes, `destructive` for errors, `warning` for problems people should fix.
- Put the icon first, as a direct child of `Alert`, so the layout places it.
- Recolor only with the theme's state pairs, as the banner recipe does. A literal color pins one look into every theme.
- Use `variant="banner"` only for a page-wide, lasting message at the top of a page.

## API reference

| Part | Built on |
| --- | --- |
| `Alert` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `AlertTitle` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `AlertDescription` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `AlertAction` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |

### Alert

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "destructive" \| "warning" \| "success" \| "info" \| "banner"` | `"default"` |

## SLDS mapping

`Alert` is `slds-scoped-notification` in the media object layout (`slds-media slds-media_center`), with the icon as its media figure. `banner` is `slds-notify slds-notify_alert`, the page-wide alert. `AlertAction` sits at the end like `slds-notify__close`, and points the button tokens at the alert's text color, so an icon button in it matches as SLDS's close button does. `AlertTitle` has no SLDS counterpart: SLDS notifications are one block of text, so a description-only alert is the exact form.

Known gaps:

- SLDS's dark scoped notification (`slds-scoped-notification_dark`) isn't a variant. It doesn't exist in Cosmos.
- Only the info banner is a variant. SLDS's warning and error banners are the class recipe in Usage, and its offline banner has no matching token pair.
- Icons are lucide's, not SLDS's utility icons.

## Accessibility

- `Alert` has `role="alert"`, so screen readers announce it when it appears. For a message that's on the page from the start and isn't urgent, pass `role="status"` instead.
- Give an icon-only button in `AlertAction` an `aria-label`, like "Close".
- Icons are hidden from assistive technology. Say the meaning in the text, not only through the color or icon.
- The default alert in Lightning Blue has gray text on gray below 4.5:1, the pair Salesforce's own light notification uses.

## Responsive behavior

- The alert fills its container; add a `max-w-*` class to narrow it. Long text wraps, and the icon stays centered beside it.
- A banner wraps its text and stays centered, keeping room at the end for its close button.

## Example code

### Possible duplicates

The default notification on a lead record: an icon, an `AlertTitle`, and a link to the duplicates in `AlertDescription`.

```tsx
import { InfoIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertDefault() {
  return (
    <Alert className="max-w-lg">
      <InfoIcon />
      <AlertTitle>Possible duplicates</AlertTitle>
      <AlertDescription>
        <p>
          This lead looks like 2 existing leads. <a href="#">View duplicates</a>
        </p>
      </AlertDescription>
    </Alert>
  )
}
```

### Variants

The error, warning, success and info colors, set with `variant`, where errors are `destructive`.

```tsx
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertVariants() {
  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Couldn't save the record</AlertTitle>
        <AlertDescription>Review the errors on this page.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>This account has no owner</AlertTitle>
        <AlertDescription>
          Assign one so the account shows up in reports.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Import finished</AlertTitle>
        <AlertDescription>240 contacts were added.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Sandbox</AlertTitle>
        <AlertDescription>
          Changes here don't affect production.
        </AlertDescription>
      </Alert>
    </div>
  )
}
```

### Banner

The page-wide alert from `variant="banner"`, with a link and a close button in `AlertAction`.

```tsx
import { InfoIcon, XIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertBanner() {
  return (
    <Alert variant="banner">
      <InfoIcon />
      <AlertDescription>
        Logged in as Ada Lovelace (ada@acme.example). <a href="#">Log out</a>
      </AlertDescription>
      <AlertAction>
        <Button variant="ghost" size="icon-sm" aria-label="Close">
          <XIcon />
        </Button>
      </AlertAction>
    </Alert>
  )
}
```
