# Icon

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/icon](https://ui.wisty.ai/icon) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a Salesforce icon. Object icons sit on their own color, and utility icons take the text color.

```bash
npx shadcn@latest add @wisty/icon
```

## Examples

- `default` (Account icon): The account icon on its color, from `name="standard:account"`, with no `label`, so screen readers skip it.
- `categories` (Categories): One icon per category in `name`: object icons on their color, an action in a circle, a file type and a utility glyph, each named by `label`.
- `sizes` (Sizes): Every `size`, for an object icon and a utility icon.
- `utility` (Utility colors): Utility icons in the default gray, the feedback colors and inverse, set with `variant`.

## When to use

- A record type needs its Salesforce object icon, like Account or Opportunity, in a header, a list or a lookup result.
- A utility glyph should look like Salesforce's own, like the warning or settings icon in a Lightning page.
- A file needs its type icon, like PDF or Excel (`doctype:*`).
- An action needs Salesforce's action icon, like New Event, in a circle.
- It replaces `lightning-icon`, with the same names, sizes and variants.

## When not to use

- Inside a primitive or a button that already draws a lucide icon. The two sets differ a little, so pick one set per area of a screen.
- For a person. Use Avatar with their picture or initials.
- For a status label. Use Badge.
- When the app can't serve static files. The icon reads Salesforce's sprites from a URL. Use lucide instead.

## Usage

The icons load from your app's static files, so copy the installed package's folder there once, as it is:

```bash
mkdir -p public/assets/icons
cp -R node_modules/@salesforce-ux/icons/dist/salesforce-lightning-design-system-icons/. public/assets/icons/
```

Then name an icon by its category and symbol. Symbols use underscores, like `standard:log_a_call`, as Salesforce's icon page lists them.

```tsx
import { Icon } from "@/components/wisty/icon"
```

```tsx
<Icon name="utility:warning" variant="warning" label="Warning" />
```

If your app serves the icons from another folder, wrap the app in `<IconProvider basePath="/static/slds-icons">`.

## Rules

- Never set an object icon's background or glyph color with classes. Use `variant` for utility icons.
- Never copy Salesforce's SVGs into your source, or edit, recolor inside or trace the artwork. Load them through Icon.
- Credit the icons. They're licensed under [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/): use them unaltered, with credit, without suggesting Salesforce endorses your app. The folder you copied already holds Salesforce's `License-for-icons.txt`; keep it there, and put a line like this in your app's credits: "Icons by Salesforce, from the Salesforce Lightning Design System, used unaltered under CC BY-ND 4.0 (https://creativecommons.org/licenses/by-nd/4.0/)."
- Keep `icon-colors.ts` under Salesforce's Terms of Use. Its object icon colors are Salesforce's ([License](https://ui.wisty.ai/docs/license)).
- Some glyphs are product logos, like `utility:slack`, `utility:tableau` and `utility:salesforce1`. Show them only to name that product; the icon license grants no trademark rights.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `IconProvider` |  | Where the app serves |
| `Icon` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |  |

### IconProvider

Where the app serves

| Prop | Type | Default |
| --- | --- | --- |
| `basePath` | `string` |  |

### Icon

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | ``${IconCategory}:${string}`` |  | An SLDS icon name, category and symbol: "standard:account", "utility:down". |
| `size`? | `keyof typeof iconSizes` | `"medium"` |  |
| `variant`? | `"default" \| "inverse" \| "warning" \| "error" \| "success"` | `"default"` | The color of a utility icon. Object and doctype icons ignore it. |
| `label`? | `string` |  | Assistive text. Without it the icon is decorative and hidden. |

### IconCategory

```ts
type IconCategory = "standard" | "custom" | "action" | "doctype" | "utility"
```

## SLDS mapping

The span is `slds-icon_container`, and the svg is `slds-icon` with a `<use>` of the category's sprite, as in SLDS's blueprint. Object icons draw a white glyph on their own color, generated from the SLDS 2 stylesheet into `icon-colors.ts`, and action icons sit in a padded circle. Doctype icons keep the colors of their artwork. Utility icons take the text color.

Known gaps:

- No `slds-icon_xxx-small` size, as `lightning-icon` has none.
- Right-to-left pages don't switch to the mirrored sprite (`symbols-rtl.svg`).
- An icon name SLDS doesn't color, like one from a newer icons package, shows its white glyph on no background.

## Accessibility

- Pass `label` unless visible text beside the icon already names it. Without one the icon is hidden from screen readers.
- An icon isn't focusable. To make it interactive, put it in a button or link and name that control.
- Add a `title` when the icon has no visible label and people need a tooltip.

## Performance

- The browser downloads one sprite per category a page uses, once, and caches it. The standard and utility sprites are about 450 KB each before compression.

## Example code

### Account icon

The account icon on its color, from `name="standard:account"`, with no `label`, so screen readers skip it.

```tsx
import { Icon } from "@/components/wisty/icon"

export default function IconDefault() {
  return <Icon name="standard:account" />
}
```

### Categories

One icon per category in `name`: object icons on their color, an action in a circle, a file type and a utility glyph, each named by `label`.

```tsx
import { Icon } from "@/components/wisty/icon"

export default function IconCategories() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon name="standard:account" label="Account" />
      <Icon name="standard:opportunity" label="Opportunity" />
      <Icon name="custom:custom14" label="Building" />
      <Icon name="action:new_event" size="small" label="New event" />
      <Icon name="doctype:pdf" label="PDF" />
      <Icon name="utility:settings" label="Settings" />
    </div>
  )
}
```

### Sizes

Every `size`, for an object icon and a utility icon.

```tsx
import { Icon } from "@/components/wisty/icon"

const sizes = ["xx-small", "x-small", "small", "medium", "large"] as const

export default function IconSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">
        {sizes.map((size) => (
          <Icon
            key={size}
            name="standard:contact"
            size={size}
            label={`Contact, ${size}`}
          />
        ))}
      </div>
      <div className="flex items-end gap-4">
        {sizes.map((size) => (
          <Icon
            key={size}
            name="utility:event"
            size={size}
            label={`Event, ${size}`}
          />
        ))}
      </div>
    </div>
  )
}
```

### Utility colors

Utility icons in the default gray, the feedback colors and inverse, set with `variant`.

```tsx
import { Icon } from "@/components/wisty/icon"

export default function IconUtility() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon name="utility:info" size="small" label="Information" />
      <Icon
        name="utility:warning"
        size="small"
        variant="warning"
        label="Warning"
      />
      <Icon name="utility:error" size="small" variant="error" label="Error" />
      <Icon
        name="utility:success"
        size="small"
        variant="success"
        label="Success"
      />
      <span className="inline-flex rounded-(--radius) bg-inverse p-2">
        <Icon
          name="utility:settings"
          size="small"
          variant="inverse"
          label="Settings"
        />
      </span>
    </div>
  )
}
```
