"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { EyeIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { Icon } from "@/components/wisty/icon"

/** A symbol in the doctype sprite of @salesforce-ux/icons. */
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

type FileCardCrop = "16-by-9" | "4-by-3" | "1-by-1"

/** The preview's image, a stand-in pattern, or why there's none yet. */
type FileCardThumbnail =
  | { state: "image"; src: string; alt: string }
  | { state: "placeholder" }
  | { state: "loading" }
  | { state: "unavailable" }

const placeholderPath =
  "M160 52L212 82L160 112L108 82ZM108 82V142L160 172V112M212 82V142L160 172M44 118L79 138L44 158L9 138ZM9 138V258L44 278V158M79 138V258L44 278M218 176A34 17 0 1 0 286 176A34 17 0 1 0 218 176M218 176V262M286 176V262M218 262A34 17 0 0 0 286 262M98 236A34 34 0 1 0 166 236A34 34 0 1 0 98 236M98 236A34 11 0 1 0 166 236A34 11 0 1 0 98 236M196 244L238 318L154 318ZM196 244L206 318M-6 6L34 29L-6 52M34 29V-20M300 30L340 53L300 76L260 53ZM260 53V100L300 123V76M66 18A22 11 0 1 0 110 18A22 11 0 1 0 66 18M66 18V-20M110 18V-20M286 296L320 316M252 316L286 296V256"

const doctypesByExtension = new Map<string, FileCardDoctype>([
  ["pdf", "pdf"],
  ["doc", "word"],
  ["docx", "word"],
  ["xls", "excel"],
  ["xlsx", "excel"],
  ["ppt", "ppt"],
  ["pptx", "ppt"],
  ["csv", "csv"],
  ["txt", "txt"],
  ["rtf", "rtf"],
  ["zip", "zip"],
  ["png", "image"],
  ["jpg", "image"],
  ["jpeg", "image"],
  ["gif", "image"],
  ["webp", "image"],
  ["svg", "image"],
  ["heic", "image"],
  ["mp4", "mp4"],
  ["mov", "video"],
  ["webm", "video"],
  ["mp3", "audio"],
  ["wav", "audio"],
  ["m4a", "audio"],
  ["html", "html"],
  ["htm", "html"],
  ["xml", "xml"],
  ["css", "css"],
  ["exe", "exe"],
  ["psd", "psd"],
  ["ai", "ai"],
  ["eps", "eps"],
  ["key", "keynote"],
  ["pages", "pages"],
  ["vsd", "visio"],
  ["vsdx", "visio"],
  ["vcf", "vcf"],
])

/** The type icon for a file name's extension in any case, or "doctype:unknown". */
function fileCardIcon(name: string): `doctype:${FileCardDoctype}` {
  const dot = name.lastIndexOf(".")
  const extension = dot > 0 ? name.slice(dot + 1).toLowerCase() : ""
  return `doctype:${doctypesByExtension.get(extension) ?? "unknown"}`
}

type FileCardContextValue = {
  name: string
  icon: `doctype:${FileCardDoctype}`
}

const FileCardContext = React.createContext<FileCardContextValue | null>(null)

function useFileCard(part: string) {
  const context = React.useContext(FileCardContext)
  if (!context) throw new Error(`${part} must be used inside <FileCard>.`)
  return context
}

/** One file as a card: a preview, and a title bar with its name and actions. */
function FileCard({
  name,
  icon,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** The file's name, with its extension. */
  name: string
  /** The type icon; defaults to the one for the name's extension. */
  icon?: `doctype:${FileCardDoctype}`
}) {
  const value = React.useMemo(
    () => ({ name, icon: icon ?? fileCardIcon(name) }),
    [name, icon]
  )

  return (
    <FileCardContext value={value}>
      <div
        data-slot="file-card"
        className={cn(
          "group/file-card relative block rounded-(--radius-2) border border-border bg-background",
          className
        )}
        {...props}
      />
    </FileCardContext>
  )
}

type ThumbnailOutcome = "ready" | "failed"

function useThumbnail(src: string | undefined) {
  const [settled, setSettled] = React.useState<{
    src: string
    phase: ThumbnailOutcome
  } | null>(null)

  const settle = React.useCallback(
    (image: HTMLImageElement, phase: ThumbnailOutcome) => {
      const imageSrc = image.getAttribute("src") ?? ""
      setSettled((current) =>
        current?.src === imageSrc && current.phase === phase
          ? current
          : { src: imageSrc, phase }
      )
    },
    []
  )

  // A cached image has finished before React attaches its events.
  const ref = React.useCallback(
    (image: HTMLImageElement | null) => {
      if (image?.complete)
        settle(image, image.naturalWidth ? "ready" : "failed")
    },
    [settle]
  )

  const phase: ThumbnailOutcome | "pending" | undefined =
    src === undefined
      ? undefined
      : src === ""
        ? "failed"
        : settled?.src === src
          ? settled.phase
          : "pending"

  return {
    phase,
    ref,
    onLoad: (event: React.SyntheticEvent<HTMLImageElement>) =>
      settle(event.currentTarget, "ready"),
    onError: (event: React.SyntheticEvent<HTMLImageElement>) =>
      settle(event.currentTarget, "failed"),
  }
}

const fileCardPreviewVariants = cva(
  "group/file-card-preview relative block w-full cursor-pointer overflow-hidden rounded-(--radius-2) border-0 bg-transparent p-0 text-start outline-none focus-visible:shadow-(--shadow-focus-outset) disabled:cursor-default",
  {
    variants: {
      crop: {
        "16-by-9": "pt-[56.25%]",
        "4-by-3": "pt-[75%]",
        "1-by-1": "pt-[100%]",
      },
    },
    defaultVariants: { crop: "16-by-9" },
  }
)

type FileCardPreviewOwnProps = {
  /** The image, a stand-in pattern, a loading image or one that can't be shown; omit it for the type icon. */
  thumbnail?: FileCardThumbnail
  /** The crop's ratio. Default "16-by-9". */
  crop?: FileCardCrop
  /** Read while the image loads. Default "Loading thumbnail". */
  loadingLabel?: string
  /** Shown when the image can't be. Default "Thumbnail unavailable". */
  unavailableLabel?: string
}

type FileCardPreviewLinkProps = Omit<
  React.ComponentProps<"a">,
  "children" | "onClick"
> &
  Partial<Record<"onClick" | "disabled", never>> & {
    /** Makes the preview a link that opens the file. Not with onClick. */
    href: string
  }

type FileCardPreviewButtonProps = Omit<
  React.ComponentProps<"button">,
  "children" | "type" | "onClick" | "disabled"
> &
  Partial<Record<"href", never>> & {
    /** Makes the preview a button that runs the page's own preview. Not with href. */
    onClick: React.MouseEventHandler<HTMLButtonElement>
    /** Turns the button off, with onClick. */
    disabled?: boolean
  }

type FileCardPreviewStaticProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onClick" | "role" | "tabIndex"
> &
  Partial<Record<"href" | "onClick" | "disabled", never>>

type FileCardPreviewProps = FileCardPreviewOwnProps &
  (
    | FileCardPreviewLinkProps
    | FileCardPreviewButtonProps
    | FileCardPreviewStaticProps
  )

/** The cropped picture of the file: a link with href, a button with onClick, or a picture with neither. */
function FileCardPreview({
  thumbnail,
  crop = "16-by-9",
  loadingLabel = "Loading thumbnail",
  unavailableLabel = "Thumbnail unavailable",
  className,
  ...props
}: FileCardPreviewProps) {
  const { name, icon } = useFileCard("FileCardPreview")
  const messageId = React.useId()
  const image = thumbnail?.state === "image" ? thumbnail : undefined
  const { phase, ref, onLoad, onError } = useThumbnail(image?.src)

  if (props.href !== undefined && props.onClick !== undefined)
    throw new Error("FileCardPreview takes href or onClick, not both.")

  const loading = thumbnail?.state === "loading" || phase === "pending"
  const unavailable = thumbnail?.state === "unavailable" || phase === "failed"
  const interactive =
    props.href !== undefined || (props.onClick !== undefined && !props.disabled)
  const describedBy =
    [props["aria-describedby"], (loading || unavailable) && messageId]
      .filter(Boolean)
      .join(" ") || undefined

  const content = (
    <>
      {thumbnail?.state === "placeholder" && (
        <svg
          data-slot="file-card-placeholder"
          aria-hidden="true"
          viewBox="0 0 320 320"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full fill-primary"
        >
          <rect width="320" height="320" />
          <path
            d={placeholderPath}
            fill="none"
            strokeOpacity={0.32}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-primary-foreground"
          />
        </svg>
      )}
      {image && phase !== "failed" && (
        <img
          key={image.src}
          ref={ref}
          data-slot="file-card-image"
          src={image.src}
          alt={image.alt}
          onLoad={onLoad}
          onError={onError}
          className={cn(
            "absolute top-1/2 left-1/2 max-w-[200%] -translate-x-1/2 -translate-y-1/2",
            phase === "pending" && "invisible"
          )}
        />
      )}
      {loading ? (
        <span data-slot="file-card-loading">
          <Spinner
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 group-has-[[data-slot=file-card-caption][data-variant=default]]/file-card:top-[45%]"
          />
          <span id={messageId} className="sr-only">
            {loadingLabel}
          </span>
        </span>
      ) : (
        (thumbnail === undefined || unavailable) && (
          <span
            data-slot="file-card-fallback"
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 group-has-[[data-slot=file-card-caption][data-variant=default]]/file-card:-translate-y-4"
          >
            <Icon name={icon} size="medium" />
            {unavailable && (
              <span
                id={messageId}
                data-slot="file-card-message"
                className="max-w-full truncate text-(length:--font-size-base) leading-(--line-height-base) text-secondary-foreground"
              >
                {unavailableLabel}
              </span>
            )}
          </span>
        )
      )}
      {interactive && !loading && (
        <span
          data-slot="file-card-overlay"
          aria-hidden="true"
          className="absolute inset-0 z-5 hidden items-center justify-center bg-(--file-card-overlay-background) [@media(any-hover:hover)]:group-hover/file-card-preview:flex [@media(any-hover:hover)]:group-focus/file-card-preview:flex"
        >
          <EyeIcon className="size-8 text-white group-has-[[data-slot=file-card-caption][data-variant=default]]/file-card:-translate-y-4" />
        </span>
      )}
    </>
  )

  const shared = {
    "data-slot": "file-card-preview",
    "data-crop": crop,
    title: name,
    "aria-busy": loading || undefined,
    "aria-describedby": describedBy,
    className: cn(fileCardPreviewVariants({ crop }), className),
  }

  if (props.href !== undefined) {
    return (
      <a aria-label={name} {...(props as FileCardPreviewLinkProps)} {...shared}>
        {content}
      </a>
    )
  }
  if (props.onClick !== undefined) {
    return (
      <button
        aria-label={name}
        {...(props as FileCardPreviewButtonProps)}
        {...shared}
        type="button"
      >
        {content}
      </button>
    )
  }
  return (
    <div {...(props as FileCardPreviewStaticProps)} {...shared}>
      {content}
    </div>
  )
}

const fileCardCaptionVariants = cva(
  "group/file-card-caption pointer-events-none absolute z-5 flex items-center",
  {
    variants: {
      variant: {
        default:
          "inset-x-0 bottom-0 gap-2 overflow-hidden rounded-b-(--radius-2) bg-muted p-2 text-(length:--font-size-base) leading-(--line-height-base) has-[[data-slot=file-card-actions]]:pe-1",
        overlay:
          "inset-0 justify-center rounded-(--radius-2) bg-(--file-card-overlay-background) text-inverse-foreground",
        scrim:
          "inset-x-0 bottom-0 h-8 items-end justify-end bg-linear-to-b from-transparent to-(--file-card-overlay-background) pe-1 pb-2 [&_:is(a,button)]:text-inverse-foreground [&_:is(a,button):active]:text-inverse-foreground/50 [&_:is(a,button):disabled]:text-inverse-foreground/25 [&_:is(a,button):focus-visible]:text-inverse-foreground [&_:is(a,button):hover:not(:active)]:text-inverse-foreground/75",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

/** The bar over the preview's bottom that holds the title and actions, or a count over the whole preview. */
function FileCardCaption({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fileCardCaptionVariants>) {
  return (
    <div
      data-slot="file-card-caption"
      data-variant={variant}
      className={cn(fileCardCaptionVariants({ variant }), className)}
      {...props}
    />
  )
}

/** The file's type icon and its name, truncated. */
function FileCardTitle({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** Words shown instead of the file's name. */
  children?: string
}) {
  const { name, icon } = useFileCard("FileCardTitle")
  const text = children ?? name

  return (
    <span
      data-slot="file-card-title"
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 group-data-[variant=overlay]/file-card-caption:justify-center",
        className
      )}
      {...props}
    >
      <Icon
        name={icon}
        size="x-small"
        className="group-data-[variant=overlay]/file-card-caption:hidden"
      />
      <span
        data-slot="file-card-name"
        title={text}
        className="block truncate text-secondary-foreground group-data-[variant=overlay]/file-card-caption:text-(length:--chart-value-size) group-data-[variant=overlay]/file-card-caption:leading-(--metric-value-line-height) group-data-[variant=overlay]/file-card-caption:text-inverse-foreground"
      >
        {text}
      </span>
    </span>
  )
}

/** The file's own actions, like Download and a menu, beside the title or on their own. */
function FileCardActions({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "role" | "aria-label"> & {
  /** Names the group after the file it acts on. */
  "aria-label": string
}) {
  return (
    <div
      role="group"
      data-slot="file-card-actions"
      className={cn(
        "pointer-events-auto flex shrink-0 items-center [&_:is(a,button)_svg:not([class*='size-'])]:size-3 [&>:is(a,button)]:size-5",
        className
      )}
      {...props}
    />
  )
}

/** The icon of the service the file comes from, over the preview's top start. */
function FileCardSource({
  label,
  title,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Icon>, "label" | "size"> & {
  /** Names the service, and is its tooltip unless title is given. */
  label: string
}) {
  return (
    <Icon
      data-slot="file-card-source"
      label={label}
      title={title ?? label}
      size="medium"
      className={cn("absolute start-2 top-2", className)}
      {...props}
    />
  )
}

export {
  FileCard,
  FileCardActions,
  FileCardCaption,
  FileCardPreview,
  FileCardSource,
  FileCardTitle,
  fileCardIcon,
  type FileCardCrop,
  type FileCardDoctype,
  type FileCardThumbnail,
}
