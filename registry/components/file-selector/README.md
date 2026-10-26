# File selector

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/file-selector](https://ui.wisty.ai/file-selector) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Picks files with an Upload Files button or by dropping them on the field. The app uploads the files it picks.

```bash
npx shadcn@latest add @wisty/file-selector
```

## Examples

- `default` (Attach a file): An attachment field on a case that takes one document, picked with Upload Files or dropped on the dashed zone.
- `multiple` (Several files): Several files in a controlled `files` list: `onFilesChange` appends what's chosen, and each file's remove button takes it out.
- `images` (Image): An account logo with `variant="images"`: a larger drop zone with the text under the button.
- `integrated` (Drop on a card): A whole Files card as a drop target with `variant="integrated"`, shown while files are dragged, and the card's own selector picks them.
- `states` (States): A required field showing "Complete this field.", or a type error from `onFilesReject`, and a `disabled` one that takes no drop.

## When to use

- People attach a file in a form, like a document on a case or a signed contract on an opportunity.
- People pick files with the Upload Files button, or drop them from their desktop onto the field.
- Only some types are allowed, like PDFs or images. Pass `accept`, and dropped files that don't match are rejected.
- A whole area should take dropped files, like a Files card or a composer. Use `variant="integrated"`.
- It replaces `lightning-input` with `type="file"`, and the file picking of `lightning-file-upload`.

## When not to use

- You need the upload itself: progress, a server, a record to attach to. The file selector only chooses files. Send them from `onFilesChange` or with the form.
- You need to show an uploaded file as a card with a preview. That's SLDS's file card, which this library doesn't have yet.
- Nothing is ever dropped, like a field in a narrow dialog. A plain `Input` with `type="file"` is enough.
- People pick a record, not a file. Use Lookup.

## Usage

```tsx
import {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorIcon,
  FileSelectorInput,
  FileSelectorText,
} from "@/components/wisty/file-selector"
```

```text
FileSelector
└── FileSelectorDropzone
    ├── FileSelectorInput
    └── FileSelectorBody
        ├── FileSelectorIcon
        ├── FileSelectorButton
        └── FileSelectorText
```

`FileSelector` holds the input's settings (`id`, `name`, `accept`, `multiple`, `disabled`, `required`) and reports what changes; the other parts only draw. `id` is the input's, for a `FieldLabel`'s `htmlFor`. `FileSelectorIcon` goes in the integrated drop zone's body.

`onFilesChange` gets the files the selector holds now: a pick replaces them, as a native file input does, and a drop brings its accepted files. `onFilesReject` gets the files it didn't take and why. To keep a list, pass `files` and append:

```tsx
<FileSelector
  id={id}
  multiple
  accept=".pdf"
  files={files}
  onFilesChange={(chosen) => setFiles((current) => [...current, ...chosen])}
  onFilesReject={(rejections) => setError(rejections[0].reason)}
>
```

`reason` is `"accept"` for a type `accept` doesn't allow, and `"multiple"` for a drop of several files when `multiple` isn't set; then every file of that drop is rejected. With `name`, the input submits the files with a form, dropped ones included.

## Rules

- Keep `FileSelectorInput` and `FileSelectorBody` inside `FileSelectorDropzone`, the input first: the button's focus and disabled looks come from the input beside it.
- Keep the button a `FileSelectorButton` inside the body. It isn't a `button`: the body is the label that opens the picker, and a real button inside a label would take the click.
- Check files again where they're uploaded. `accept` only filters what people pick and drop here.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on |
| --- | --- |
| `FileSelector` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `FileSelectorDropzone` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `FileSelectorInput` | [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) |
| `FileSelectorBody` | [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label) |
| `FileSelectorButton` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `FileSelectorText` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |
| `FileSelectorIcon` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) |

### FileSelector

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant`? | `"files" \| "images" \| "integrated"` | `"files"` |  |
| `id`? | `string` |  | The input's id, for a `FieldLabel`'s `htmlFor`. |
| `name`? | `string` |  | The input's name, to submit the files with a form. |
| `accept`? | `string` |  | File types to take, as the native input's `accept`: `.pdf,image/*`. |
| `multiple`? | `boolean` | `false` | Take several files at once. |
| `disabled`? | `boolean` | `false` |  |
| `required`? | `boolean` | `false` |  |
| `form`? | `string` |  | The id of a form the input belongs to, outside it. |
| `files`? | `File[]` |  | The files the input holds, controlled. |
| `onFilesChange`? | `(files: File[], details: FileSelectorChangeDetails) => void` |  | Called with what a pick chose, replacing the input's files, or the accepted files of a drop. |
| `onFilesReject`? | `( rejections: FileSelectorRejection[], details: FileSelectorChangeDetails ) => void` |  | Files a pick or a drop brought that the selector didn't take. |

### FileSelectorSource

```ts
type FileSelectorSource = "picker" | "drop"
```

### FileSelectorChangeDetails

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `FileSelectorSource` |  | Whether the files came from the file picker or a drop. |

### FileSelectorRejection

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | `File` |  |  |
| `reason` | `"accept" \| "multiple"` |  | "accept": the type doesn't match `accept`; "multiple": several files came without `multiple`. |

## SLDS mapping

The file selector is SLDS's file selector as `lightning-input` with `type="file"` draws it. `FileSelector` is `slds-file-selector` with `slds-file-selector_files`, `_images` or `_integrated`. `FileSelectorDropzone` is `slds-file-selector__dropzone`, with `slds-has-drag-over` as `data-drag-over` and `slds-has-drag` as `data-dragging`. `FileSelectorInput` is `slds-file-selector__input slds-assistive-text`, and `FileSelectorBody` is the `slds-file-selector__body` label. `FileSelectorButton` is `slds-file-selector__button slds-button_neutral` with the upload icon, `FileSelectorText` is `slds-file-selector__text`, and `FileSelectorIcon` is `slds-file-selector__body-icon`.

Known gaps:

- The upload icons are lucide's, where SLDS draws `utility:upload`.
- No "Dragover with error" look: a drop of the wrong type is only reported when it lands, since a drag doesn't tell the page the files' names.
- No file card (`slds-file`) for files already chosen. List them with Item.

## Accessibility

- Name the field with a `FieldLabel` whose `htmlFor` is `FileSelector`'s `id`. The body is a second label, so the input's name is the field label followed by "Upload Files or Drop Files".
- The input is the control: Tab reaches it, its focus rings the button, and Space opens the file picker. The drop zone is never focusable, so dropping is never the only way to pick.
- An integrated drop zone is drop only and hidden from assistive technology. Keep a files or images selector, or another way to pick, in its container.
- For an error, set `aria-invalid` and `aria-describedby` on `FileSelectorInput`, as for any field. The drop zone doesn't change; the message is the error.

## Responsive behavior

- Below 768px the drop text is hidden and only the button shows, as on a phone nothing is dropped.

## Example code

### Attach a file

An attachment field on a case that takes one document, picked with Upload Files or dropped on the dashed zone.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorInput,
  FileSelectorText,
} from "@/components/wisty/file-selector"

export default function FileSelectorDefault() {
  const id = useId()

  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor={id}>Attachment</FieldLabel>
      <FileSelector
        id={id}
        name="attachment"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
      >
        <FileSelectorDropzone>
          <FileSelectorInput />
          <FileSelectorBody>
            <FileSelectorButton>Upload Files</FileSelectorButton>
            <FileSelectorText>or Drop Files</FileSelectorText>
          </FileSelectorBody>
        </FileSelectorDropzone>
      </FileSelector>
    </Field>
  )
}
```

### Several files

Several files in a controlled `files` list: `onFilesChange` appends what's chosen, and each file's remove button takes it out.

```tsx
"use client"

import { useId, useState } from "react"
import { FileTextIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorInput,
  FileSelectorText,
} from "@/components/wisty/file-selector"

function sampleFiles() {
  return [
    new File([new ArrayBuffer(248_000)], "Renewal quote Q3.pdf", {
      type: "application/pdf",
      lastModified: Date.UTC(2026, 5, 18),
    }),
    new File([new ArrayBuffer(36_000)], "Site survey notes.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      lastModified: Date.UTC(2026, 5, 18),
    }),
  ]
}

function formatSize(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1000))} KB`
}

export default function FileSelectorMultiple() {
  const id = useId()
  const [files, setFiles] = useState<File[]>(sampleFiles)

  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor={id}>Attachments</FieldLabel>
      <FileSelector
        id={id}
        name="attachments"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        multiple
        files={files}
        onFilesChange={(chosen) =>
          setFiles((current) => [...current, ...chosen])
        }
      >
        <FileSelectorDropzone>
          <FileSelectorInput />
          <FileSelectorBody>
            <FileSelectorButton>Upload Files</FileSelectorButton>
            <FileSelectorText>or Drop Files</FileSelectorText>
          </FileSelectorBody>
        </FileSelectorDropzone>
      </FileSelector>
      <ItemGroup aria-label="Chosen files">
        {files.map((file, index) => (
          <Item
            key={`${file.name}-${file.lastModified}-${index}`}
            role="listitem"
            variant="outline"
            size="sm"
          >
            <ItemMedia variant="icon">
              <FileTextIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{file.name}</ItemTitle>
              <ItemDescription>{formatSize(file.size)}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${file.name}`}
                onClick={() =>
                  setFiles((current) => current.filter((_, i) => i !== index))
                }
              >
                <XIcon />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </Field>
  )
}
```

### Image

An account logo with `variant="images"`: a larger drop zone with the text under the button.

```tsx
import { useId } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorInput,
  FileSelectorText,
} from "@/components/wisty/file-selector"

export default function FileSelectorImages() {
  const id = useId()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={id}>Account logo</FieldLabel>
      <FileSelector
        id={id}
        name="logo"
        accept="image/png,image/jpeg,image/svg+xml"
        variant="images"
      >
        <FileSelectorDropzone>
          <FileSelectorInput />
          <FileSelectorBody>
            <FileSelectorButton>Upload Image</FileSelectorButton>
            <FileSelectorText>or Drop Image</FileSelectorText>
          </FileSelectorBody>
        </FileSelectorDropzone>
      </FileSelector>
    </Field>
  )
}
```

### Drop on a card

A whole Files card as a drop target with `variant="integrated"`, shown while files are dragged, and the card's own selector picks them.

```tsx
"use client"

import { useId, useState } from "react"
import { FileTextIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorIcon,
  FileSelectorInput,
  FileSelectorText,
} from "@/components/wisty/file-selector"

export default function FileSelectorIntegrated() {
  const id = useId()
  const [names, setNames] = useState(["Renewal quote Q3.pdf"])

  function add(files: File[]) {
    setNames((current) => [...current, ...files.map((file) => file.name)])
  }

  return (
    <FileSelector
      variant="integrated"
      multiple
      onFilesChange={add}
      className="max-w-sm"
    >
      <FileSelectorDropzone>
        <FileSelectorInput />
        <FileSelectorBody>
          <FileSelectorIcon />
          <FileSelectorText>Drop Files</FileSelectorText>
        </FileSelectorBody>
      </FileSelectorDropzone>
      <Card className="min-h-60">
        <CardHeader>
          <CardTitle>Files ({names.length})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ItemGroup aria-label="Files">
            {names.map((name, index) => (
              <Item key={`${name}-${index}`} role="listitem" size="sm">
                <ItemMedia variant="icon">
                  <FileTextIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{name}</ItemTitle>
                  <ItemDescription>Jun 18, 2026</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
          <FileSelector id={id} multiple onFilesChange={add}>
            <FileSelectorDropzone>
              <FileSelectorInput />
              <FileSelectorBody>
                <FileSelectorButton>Upload Files</FileSelectorButton>
                <FileSelectorText>or Drop Files</FileSelectorText>
              </FileSelectorBody>
            </FileSelectorDropzone>
          </FileSelector>
        </CardContent>
      </Card>
    </FileSelector>
  )
}
```

### States

A required field showing "Complete this field.", or a type error from `onFilesReject`, and a `disabled` one that takes no drop.

```tsx
"use client"

import { useId, useState } from "react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorInput,
  FileSelectorText,
} from "@/components/wisty/file-selector"

const messages = {
  required: "Complete this field.",
  accept: "File type not supported. Upload a PDF.",
}

export default function FileSelectorStates() {
  const id = useId()
  const [error, setError] = useState<keyof typeof messages | undefined>(
    "required"
  )

  return (
    <FieldGroup className="max-w-sm">
      <Field data-invalid={error !== undefined}>
        <FieldLabel htmlFor={`${id}-contract`}>
          <span>
            <abbr
              title="required"
              className="me-0.5 text-destructive no-underline"
            >
              *
            </abbr>
            Signed contract
          </span>
        </FieldLabel>
        <FileSelector
          id={`${id}-contract`}
          name="contract"
          accept=".pdf"
          required
          onFilesChange={(files) =>
            setError(files.length > 0 ? undefined : "required")
          }
          onFilesReject={() => setError("accept")}
        >
          <FileSelectorDropzone>
            <FileSelectorInput
              aria-invalid={error !== undefined}
              aria-describedby={error ? `${id}-contract-error` : undefined}
            />
            <FileSelectorBody>
              <FileSelectorButton>Upload Files</FileSelectorButton>
              <FileSelectorText>or Drop Files</FileSelectorText>
            </FileSelectorBody>
          </FileSelectorDropzone>
        </FileSelector>
        {error ? (
          <FieldError id={`${id}-contract-error`}>{messages[error]}</FieldError>
        ) : null}
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-invoice`}>Invoice</FieldLabel>
        <FileSelector id={`${id}-invoice`} name="invoice" disabled>
          <FileSelectorDropzone>
            <FileSelectorInput />
            <FileSelectorBody>
              <FileSelectorButton>Upload Files</FileSelectorButton>
              <FileSelectorText>or Drop Files</FileSelectorText>
            </FileSelectorBody>
          </FileSelectorDropzone>
        </FileSelector>
      </Field>
    </FieldGroup>
  )
}
```
