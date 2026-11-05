# File card

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/file-card](https://ui.wisty.ai/file-card) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows a file as a card with its thumbnail or type icon, its name and actions. To pick files, use File selector.

```bash
npx shadcn@latest add @wisty/file-card
```

## Examples

- `default` (Proposal file): A proposal's preview that opens the file, drawn with the placeholder pattern, with its name, a download link and a menu of file actions.
- `crops` (Crops): The placeholder pattern filling each `crop` on `FileCardPreview`, with long names truncated before the download button.
- `no-title` (Without a title): An image with no `FileCardTitle`: `variant="scrim"` on `FileCardCaption` puts the download button on a dark gradient.
- `more` (More files): Two of a record's files and a tile linking to 22 more, with `variant="overlay"` and an `aria-label` that names the link.
- `attachment` (Email attachment): A captionless card as an attachment row's picture, beside the linked file name, its size and a download link.
- `selected` (Chosen files): Files just chosen in a file selector, as static cards with a Remove button and the type icon read from each name.
- `source` (External source): A Quip document with `FileCardSource` naming the service it comes from, beside its own type icon.
- `states` (Thumbnail states): A thumbnail still loading, one that can't be shown, and a file of an unknown type, each keeping its name and link.

## When to use

- A record page lists its files as a grid of cards, each with a thumbnail or a type icon and its name.
- One file needs a preview people open, with Download and a menu of file actions beside its name.
- An attachment row needs a small picture of the file, like an email's attachment beside its linked name.
- Files just chosen in a File selector should show as cards before they're uploaded.
- It replaces SLDS's file card, what `lightning-file-card` and the Files related list draw.

## When not to use

- People pick or drop files. Use File selector, then show what they chose with File card.
- The upload itself, with progress and a server. The card only draws a file the page already knows.
- A plain list of files with no pictures, like names and sizes in a table or a list. Use Item or Table.
- A record or a block of content that isn't a file. Use Card.

## Usage

Copy the icon package's folder to the app's static files once, unchanged, as Icon does:

```bash
mkdir -p public/assets/icons
cp -R node_modules/@salesforce-ux/icons/dist/salesforce-lightning-design-system-icons/. public/assets/icons/
```

```tsx
import {
  FileCard,
  FileCardActions,
  FileCardCaption,
  FileCardPreview,
  FileCardSource,
  FileCardTitle,
} from "@/components/wisty/file-card"
```

```text
FileCard
├── FileCardPreview
├── FileCardCaption
│   ├── FileCardTitle
│   └── FileCardActions
└── FileCardSource
```

```tsx
<FileCard name="Site survey.csv">
  <FileCardPreview href="/files/site-survey" />
  <FileCardCaption>
    <FileCardTitle />
  </FileCardCaption>
</FileCard>
```

`FileCardPreview` is a link with `href`, a button with `onClick`, and a picture with neither. Its `thumbnail` is the image, `{ state: "loading" }` while the page fetches one, or `{ state: "unavailable" }` when it can't be shown. Leave it out for a file that has no image, and the preview shows its type icon. `{ state: "placeholder" }` fills the preview with a pattern in the theme's primary colors instead, for a page with no real images yet, like a prototype over sample records. The type icon comes from the name's extension, or from `icon` when the page knows better:

```tsx
<FileCard name="Site survey notes" icon="doctype:quip_doc">
```

`fileCardIcon(name)` gives the same icon for a name, for a list that draws it elsewhere.

## Rules

- Put actions in `FileCardActions`, never inside `FileCardPreview`. The preview is the card's one link or button.
- Give every action button `type="button"` in a form, or it submits the form.
- Keep `FileCardTitle` and `FileCardActions` in a default `FileCardCaption`. A `scrim` caption holds only actions, and an `overlay` caption only a `FileCardTitle` with its count.
- Pass `icon` only as a `doctype:` symbol the icon package has. The type checks it.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `FileCard` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | One file as a card: a preview, and a title bar with its name and actions. |
| `FileCardPreview` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | The cropped picture of the file: a link with href, a button with onClick, or a picture with neither. |
| `FileCardCaption` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | The bar over the preview's bottom that holds the title and actions, or a count over the whole preview. |
| `FileCardTitle` | [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span) | The file's type icon and its name, truncated. |
| `FileCardActions` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | The file's own actions, like Download and a menu, beside the title or on their own. |
| `FileCardSource` | [Icon](https://ui.wisty.ai/icon#api-Icon) | The icon of the service the file comes from, over the preview's top start. |

### FileCard

One file as a card: a preview, and a title bar with its name and actions.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | The file's name, with its extension. |
| `icon`? | ``doctype:${FileCardDoctype}`` |  | The type icon; defaults to the one for the name's extension. |

### FileCardPreview

The cropped picture of the file: a link with href, a button with onClick, or a picture with neither.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `thumbnail`? | `FileCardThumbnail` |  | The image, a stand-in pattern, a loading image or one that can't be shown; omit it for the type icon. |
| `crop`? | `FileCardCrop` | `"16-by-9"` | The crop's ratio. Default "16-by-9". |
| `loadingLabel`? | `string` | `"Loading thumbnail"` | Read while the image loads. Default "Loading thumbnail". |
| `unavailableLabel`? | `string` | `"Thumbnail unavailable"` | Shown when the image can't be. Default "Thumbnail unavailable". |
| `href`? | `string` |  | Makes the preview a link that opens the file. Not with onClick. |
| `onClick`? | `React.MouseEventHandler<HTMLButtonElement>` |  | Makes the preview a button that runs the page's own preview. Not with href. |
| `disabled`? | `boolean` |  | Turns the button off, with onClick. |

### FileCardCaption

The bar over the preview's bottom that holds the title and actions, or a count over the whole preview.

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "overlay" \| "scrim"` | `"default"` |

### FileCardTitle

The file's type icon and its name, truncated.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children`? | `string` |  | Words shown instead of the file's name. |

### FileCardActions

The file's own actions, like Download and a menu, beside the title or on their own.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` |  | Names the group after the file it acts on. |

### FileCardSource

The icon of the service the file comes from, over the preview's top start.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the service, and is its tooltip unless title is given. |

### fileCardIcon

The type icon for a file name's extension in any case, or "doctype:unknown".

| Parameter | Type | Default |
| --- | --- | --- |
| `name` | `string` |  |

Returns `"doctype:audio" | "doctype:html" | "doctype:link" | "doctype:video" | "doctype:image" | "doctype:unknown" | "doctype:overlay" | "doctype:ai" | "doctype:attachment" | "doctype:box_notes" | "doctype:css" | "doctype:csv" | "doctype:eps" | "doctype:excel" | "doctype:exe" | "doctype:flash" | "doctype:folder" | "doctype:gdoc" | "doctype:gdocs" | "doctype:gform" | "doctype:gpres" | "doctype:gsheet" | "doctype:keynote" | "doctype:library_folder" | "doctype:mp4" | "doctype:pack" | "doctype:pages" | "doctype:pdf" | "doctype:ppt" | "doctype:psd" | "doctype:quip_doc" | "doctype:quip_sheet" | "doctype:quip_slide" | "doctype:rtf" | "doctype:shared_folder" | "doctype:slack_canvas" | "doctype:slack_list_item" | "doctype:slack_lists" | "doctype:slide" | "doctype:stypi" | "doctype:txt" | "doctype:vcf" | "doctype:visio" | "doctype:webex" | "doctype:word" | "doctype:xml" | "doctype:zip"`.

### FileCardDoctype

A symbol in the doctype sprite of

```ts
type FileCardDoctype =
  | "ai"
  | "attachment"
  | "audio"
  | "box_notes"
  | "css"
  | "csv"
  | "eps"
  | "excel"
  | "exe"
  | "flash"
  | "folder"
  | "gdoc"
  | "gdocs"
  | "gform"
  | "gpres"
  | "gsheet"
  | "html"
  | "image"
  | "keynote"
  | "library_folder"
  | "link"
  | "mp4"
  | "overlay"
  | "pack"
  | "pages"
  | "pdf"
  | "ppt"
  | "psd"
  | "quip_doc"
  | "quip_sheet"
  | "quip_slide"
  | "rtf"
  | "shared_folder"
  | "slack_canvas"
  | "slack_list_item"
  | "slack_lists"
  | "slide"
  | "stypi"
  | "txt"
  | "unknown"
  | "vcf"
  | "video"
  | "visio"
  | "webex"
  | "word"
  | "xml"
  | "zip"
```

### FileCardCrop

```ts
type FileCardCrop = "16-by-9" | "4-by-3" | "1-by-1"
```

### FileCardThumbnail

The preview's image, a stand-in pattern, or why there's none yet.

```ts
type FileCardThumbnail =
  | { state: "image"; src: string; alt: string }
  | { state: "placeholder" }
  | { state: "loading" }
  | { state: "unavailable" }
```

## SLDS mapping

`FileCard` is `slds-file slds-file_card`. `FileCardPreview` is the `slds-file__crop` link, with the image, the centered `slds-file__icon` or the medium spinner of `slds-file_loading` inside. `FileCardCaption` is `slds-file__title_card` by default, `slds-file__title_overlay` over `slds-file_overlay` as `overlay`, and `slds-file__title_scrim` as `scrim`. `FileCardTitle` is the small media object with the x-small type icon and `slds-file__text slds-truncate`. `FileCardActions` is `slds-file__actions-menu` with its button group, and `FileCardSource` is `slds-file__external-icon`.

Known gaps:

- No uncropped figure (`slds-file__figure`) or portrait figure (`slds-file__figure_portrait`). Every preview has a crop.
- No link attachment, the media object with a small file and a source line.
- The preview's eye and the action icons are lucide's, where SLDS draws its own eye and `utility:download` and `utility:down`.
- "Thumbnail unavailable" under the type icon is an addition. SLDS draws a missing and a broken image the same.
- The placeholder pattern is an addition. SLDS draws a file with no image as its type icon.

## Accessibility

- A link or button preview is named by the file's name. Give the more-files tile an `aria-label` that says what it opens, like "Show 22 more files".
- Give each action its own name with the file in it, like "Download Renewal proposal.pdf", and give `FileCardActions` an `aria-label`.
- Write an `alt` that describes the image, or `""` when the name beside it says it all, as in an attachment row.
- While the image loads the preview is `aria-busy` and described by "Loading thumbnail". When it can't be shown, by "Thumbnail unavailable". Change the words with `loadingLabel` and `unavailableLabel`.

## Motion

- The spinner turns while a thumbnail loads, and stops with reduced motion.

## Responsive behavior

- The card fills its container. The page sets its width or the grid's columns.
- A long name truncates before the actions, and the full name shows as the preview's tooltip.
- On a device with no hover, the dark layer and the eye don't show.

## Example code

### Proposal file

A proposal's preview that opens the file, drawn with the placeholder pattern, with its name, a download link and a menu of file actions.

```tsx
import { ChevronDownIcon, DownloadIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileCard,
  FileCardActions,
  FileCardCaption,
  FileCardPreview,
  FileCardTitle,
} from "@/components/wisty/file-card"

export default function FileCardDefault() {
  return (
    <FileCard name="Renewal proposal.pdf" className="w-full max-w-xs">
      <FileCardPreview
        href="/files/renewal-proposal"
        thumbnail={{ state: "placeholder" }}
      />
      <FileCardCaption>
        <FileCardTitle />
        <FileCardActions aria-label="Actions for Renewal proposal.pdf">
          <a
            href="/files/renewal-proposal/download"
            download
            aria-label="Download Renewal proposal.pdf"
            className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
          >
            <DownloadIcon />
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="More actions for Renewal proposal.pdf"
              className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
            >
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Upload New Version</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </FileCardActions>
      </FileCardCaption>
    </FileCard>
  )
}
```

### Crops

The placeholder pattern filling each `crop` on `FileCardPreview`, with long names truncated before the download button.

```tsx
import { DownloadIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  FileCard,
  FileCardActions,
  FileCardCaption,
  FileCardPreview,
  FileCardTitle,
} from "@/components/wisty/file-card"

export default function FileCardCrops() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <FileCard
        name="Storefront renovation, north entrance.jpg"
        className="w-56"
      >
        <FileCardPreview
          href="/files/storefront-north"
          thumbnail={{ state: "placeholder" }}
        />
        <FileCardCaption>
          <FileCardTitle />
          <FileCardActions aria-label="Actions for Storefront renovation, north entrance.jpg">
            <a
              href="/files/storefront-north/download"
              download
              aria-label="Download Storefront renovation, north entrance.jpg"
              className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
            >
              <DownloadIcon />
            </a>
          </FileCardActions>
        </FileCardCaption>
      </FileCard>
      <FileCard
        name="Storefront renovation, east entrance.jpg"
        className="w-56"
      >
        <FileCardPreview
          href="/files/storefront-east"
          crop="4-by-3"
          thumbnail={{ state: "placeholder" }}
        />
        <FileCardCaption>
          <FileCardTitle />
          <FileCardActions aria-label="Actions for Storefront renovation, east entrance.jpg">
            <a
              href="/files/storefront-east/download"
              download
              aria-label="Download Storefront renovation, east entrance.jpg"
              className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
            >
              <DownloadIcon />
            </a>
          </FileCardActions>
        </FileCardCaption>
      </FileCard>
      <FileCard
        name="Storefront renovation, south entrance.jpg"
        className="w-56"
      >
        <FileCardPreview
          href="/files/storefront-south"
          crop="1-by-1"
          thumbnail={{ state: "placeholder" }}
        />
        <FileCardCaption>
          <FileCardTitle />
          <FileCardActions aria-label="Actions for Storefront renovation, south entrance.jpg">
            <a
              href="/files/storefront-south/download"
              download
              aria-label="Download Storefront renovation, south entrance.jpg"
              className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
            >
              <DownloadIcon />
            </a>
          </FileCardActions>
        </FileCardCaption>
      </FileCard>
    </div>
  )
}
```

### Without a title

An image with no `FileCardTitle`: `variant="scrim"` on `FileCardCaption` puts the download button on a dark gradient.

```tsx
import { DownloadIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  FileCard,
  FileCardActions,
  FileCardCaption,
  FileCardPreview,
} from "@/components/wisty/file-card"

const brandPattern =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Crect width='320' height='320' fill='%23066afe'/%3E%3Cpath d='M160 52L212 82L160 112L108 82ZM108 82V142L160 172V112M212 82V142L160 172M44 118L79 138L44 158L9 138ZM9 138V258L44 278V158M79 138V258L44 278M218 176A34 17 0 1 0 286 176A34 17 0 1 0 218 176M218 176V262M286 176V262M218 262A34 17 0 0 0 286 262M98 236A34 34 0 1 0 166 236A34 34 0 1 0 98 236M98 236A34 11 0 1 0 166 236A34 11 0 1 0 98 236M196 244L238 318L154 318ZM196 244L206 318M-6 6L34 29L-6 52M34 29V-20M300 30L340 53L300 76L260 53ZM260 53V100L300 123V76M66 18A22 11 0 1 0 110 18A22 11 0 1 0 66 18M66 18V-20M110 18V-20M286 296L320 316M252 316L286 296V256' fill='none' stroke='%23fff' stroke-opacity='.32' stroke-linejoin='round' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E"

export default function FileCardNoTitle() {
  return (
    <FileCard name="Brand pattern.svg" className="w-full max-w-xs">
      <FileCardPreview
        href="/files/brand-pattern"
        thumbnail={{
          state: "image",
          src: brandPattern,
          alt: "Line drawings of simple solids on blue",
        }}
      />
      <FileCardCaption variant="scrim">
        <FileCardActions aria-label="Actions for Brand pattern.svg">
          <a
            href="/files/brand-pattern/download"
            download
            aria-label="Download Brand pattern.svg"
            className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
          >
            <DownloadIcon />
          </a>
        </FileCardActions>
      </FileCardCaption>
    </FileCard>
  )
}
```

### More files

Two of a record's files and a tile linking to 22 more, with `variant="overlay"` and an `aria-label` that names the link.

```tsx
import {
  FileCard,
  FileCardCaption,
  FileCardPreview,
  FileCardTitle,
} from "@/components/wisty/file-card"

export default function FileCardMore() {
  return (
    <ul aria-label="Files" className="grid w-full max-w-2xl grid-cols-3 gap-2">
      <li>
        <FileCard name="Renewal proposal.pdf">
          <FileCardPreview
            href="/files/renewal-proposal"
            crop="4-by-3"
            thumbnail={{ state: "placeholder" }}
          />
          <FileCardCaption>
            <FileCardTitle />
          </FileCardCaption>
        </FileCard>
      </li>
      <li>
        <FileCard name="Site survey.png">
          <FileCardPreview
            href="/files/site-survey"
            crop="4-by-3"
            thumbnail={{ state: "placeholder" }}
          />
          <FileCardCaption>
            <FileCardTitle />
          </FileCardCaption>
        </FileCard>
      </li>
      <li>
        <FileCard name="22 more files">
          <FileCardPreview
            href="/accounts/acme/files"
            aria-label="Show 22 more files"
            crop="4-by-3"
            thumbnail={{ state: "placeholder" }}
          />
          <FileCardCaption variant="overlay">
            <FileCardTitle>+22</FileCardTitle>
          </FileCardCaption>
        </FileCard>
      </li>
    </ul>
  )
}
```

### Email attachment

A captionless card as an attachment row's picture, beside the linked file name, its size and a download link.

```tsx
import { DownloadIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { FileCard, FileCardPreview } from "@/components/wisty/file-card"

export default function FileCardAttachment() {
  return (
    <Item variant="outline" size="sm" className="w-full max-w-md">
      <ItemMedia>
        <FileCard name="Service agreement.pdf" className="w-24">
          <FileCardPreview thumbnail={{ state: "placeholder" }} />
        </FileCard>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <a href="/files/service-agreement">Service agreement.pdf</a>
        </ItemTitle>
        <ItemDescription>PDF · 248 KB</ItemDescription>
      </ItemContent>
      <ItemActions>
        <a
          href="/files/service-agreement/download"
          download
          aria-label="Download Service agreement.pdf"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        >
          <DownloadIcon />
        </a>
      </ItemActions>
    </Item>
  )
}
```

### Chosen files

Files just chosen in a file selector, as static cards with a Remove button and the type icon read from each name.

```tsx
"use client"

import { useId, useState } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  FileCard,
  FileCardActions,
  FileCardCaption,
  FileCardPreview,
  FileCardTitle,
} from "@/components/wisty/file-card"
import {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorInput,
  FileSelectorText,
} from "@/components/wisty/file-selector"

const chosenOnLoad = () => [
  new File(["%PDF"], "Signed order form.pdf", {
    type: "application/pdf",
    lastModified: Date.UTC(2026, 10, 3),
  }),
  new File(["PK"], "Pricing model.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    lastModified: Date.UTC(2026, 10, 3),
  }),
]

export default function FileCardSelected() {
  const id = useId()
  const [files, setFiles] = useState<File[]>(chosenOnLoad)

  return (
    <Field className="max-w-md">
      <FieldLabel htmlFor={id}>Contract documents</FieldLabel>
      <FileSelector
        id={id}
        name="contract-documents"
        accept=".pdf,.docx,.xlsx"
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
      <ul aria-label="Chosen files" className="grid grid-cols-2 gap-2">
        {files.map((file, index) => (
          <li key={`${file.name}-${file.lastModified}-${index}`}>
            <FileCard name={file.name}>
              <FileCardPreview />
              <FileCardCaption>
                <FileCardTitle />
                <FileCardActions aria-label={`Actions for ${file.name}`}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setFiles((current) =>
                        current.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <XIcon />
                  </Button>
                </FileCardActions>
              </FileCardCaption>
            </FileCard>
          </li>
        ))}
      </ul>
    </Field>
  )
}
```

### External source

A Quip document with `FileCardSource` naming the service it comes from, beside its own type icon.

```tsx
import {
  FileCard,
  FileCardCaption,
  FileCardPreview,
  FileCardSource,
  FileCardTitle,
} from "@/components/wisty/file-card"

export default function FileCardSourceExample() {
  return (
    <FileCard
      name="Site survey notes"
      icon="doctype:quip_doc"
      className="w-full max-w-xs"
    >
      <FileCardPreview href="/files/site-survey-notes" />
      <FileCardCaption>
        <FileCardTitle />
      </FileCardCaption>
      <FileCardSource name="utility:quip" label="From Quip" />
    </FileCard>
  )
}
```

### Thumbnail states

A thumbnail still loading, one that can't be shown, and a file of an unknown type, each keeping its name and link.

```tsx
import { DownloadIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  FileCard,
  FileCardActions,
  FileCardCaption,
  FileCardPreview,
  FileCardTitle,
} from "@/components/wisty/file-card"

export default function FileCardStates() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <FileCard name="Floor plan.png" className="w-56">
        <FileCardPreview
          href="/files/floor-plan"
          thumbnail={{ state: "loading" }}
        />
        <FileCardCaption>
          <FileCardTitle />
        </FileCardCaption>
      </FileCard>
      <FileCard name="Inspection photos.zip" className="w-56">
        <FileCardPreview
          href="/files/inspection-photos"
          thumbnail={{ state: "unavailable" }}
        />
        <FileCardCaption>
          <FileCardTitle />
          <FileCardActions aria-label="Actions for Inspection photos.zip">
            <a
              href="/files/inspection-photos/download"
              download
              aria-label="Download Inspection photos.zip"
              className={buttonVariants({ variant: "ghost", size: "icon-xs" })}
            >
              <DownloadIcon />
            </a>
          </FileCardActions>
        </FileCardCaption>
      </FileCard>
      <FileCard name="Meter readings.dat" className="w-56">
        <FileCardPreview href="/files/meter-readings" />
        <FileCardCaption>
          <FileCardTitle />
        </FileCardCaption>
      </FileCard>
    </div>
  )
}
```
