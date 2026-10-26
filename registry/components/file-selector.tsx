"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { UploadIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type FileSelectorSource = "picker" | "drop"

type FileSelectorChangeDetails = {
  /** Whether the files came from the file picker or a drop. */
  source: FileSelectorSource
}

type FileSelectorRejection = {
  file: File
  /** "accept": the type doesn't match `accept`; "multiple": several files came without `multiple`. */
  reason: "accept" | "multiple"
}

type FileSelectorContextValue = {
  variant: "files" | "images" | "integrated"
  inputId: string
  name?: string
  accept?: string
  multiple: boolean
  disabled: boolean
  required: boolean
  form?: string
  dragging: boolean
  setInputRef: (node: HTMLInputElement | null) => void
  receive: (files: File[], source: FileSelectorSource) => void
}

const FileSelectorContext =
  React.createContext<FileSelectorContextValue | null>(null)

function useFileSelectorContext(part: string) {
  const context = React.useContext(FileSelectorContext)
  if (!context) throw new Error(`${part} must be used inside <FileSelector>.`)
  return context
}

// Whether a drag carries files, not text or a link.
function hasFiles(dataTransfer: DataTransfer | null) {
  return dataTransfer ? Array.from(dataTransfer.types).includes("Files") : false
}

// accept as the native input reads it: extensions, MIME types and wildcards.
function matchesAccept(file: File, accept: string | undefined) {
  const patterns = (accept ?? "")
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean)
  if (patterns.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return name.endsWith(pattern)
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1))
    return type === pattern
  })
}

// As far as the DOM allows: any list where DataTransfer exists, an empty one everywhere.
function setInputFiles(input: HTMLInputElement, files: File[]) {
  if (files.length === 0) {
    input.value = ""
    return
  }
  if (typeof DataTransfer === "undefined") return
  const transfer = new DataTransfer()
  for (const file of files) transfer.items.add(file)
  input.files = transfer.files
}

function setRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node)
  else if (ref) ref.current = node
}

const fileSelectorVariants = cva("group/file-selector", {
  variants: {
    variant: {
      files: "inline-flex",
      images: "block",
      // While files are dragged over the window, everything beside the drop
      // zone dims, so its card reads as an overlay.
      integrated:
        "relative block size-full data-dragging:[&>:not([data-slot=file-selector-dropzone])]:text-(--file-selector-dragging-foreground) data-dragging:[&>:not([data-slot=file-selector-dropzone])_*]:text-(--file-selector-dragging-foreground)",
    },
  },
  defaultVariants: {
    variant: "files",
  },
})

function FileSelector({
  className,
  variant = "files",
  id,
  name,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  form,
  files,
  onFilesChange,
  onFilesReject,
  ref,
  ...props
}: Omit<React.ComponentProps<"div">, "id"> &
  VariantProps<typeof fileSelectorVariants> & {
    /** The input's id, for a `FieldLabel`'s `htmlFor`. */
    id?: string
    /** The input's name, to submit the files with a form. */
    name?: string
    /** File types to take, as the native input's `accept`: `.pdf,image/*`. */
    accept?: string
    /** Take several files at once. */
    multiple?: boolean
    disabled?: boolean
    required?: boolean
    /** The id of a form the input belongs to, outside it. */
    form?: string
    /** The files the input holds, controlled. */
    files?: File[]
    /** Called with what a pick chose, replacing the input's files, or the accepted files of a drop. */
    onFilesChange?: (files: File[], details: FileSelectorChangeDetails) => void
    /** Files a pick or a drop brought that the selector didn't take. */
    onFilesReject?: (
      rejections: FileSelectorRejection[],
      details: FileSelectorChangeDetails
    ) => void
  }) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const variantName = variant ?? "files"
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  // A controlled input holds `files`. React runs the ref callback again
  // when they change, so the input follows without an effect.
  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (node && files !== undefined) setInputFiles(node, files)
    },
    [files]
  )

  function receive(list: File[], source: FileSelectorSource) {
    const accepted: File[] = []
    const rejected: FileSelectorRejection[] = []
    if (!multiple && list.length > 1) {
      for (const file of list) rejected.push({ file, reason: "multiple" })
    } else {
      for (const file of list) {
        if (matchesAccept(file, accept)) accepted.push(file)
        else rejected.push({ file, reason: "accept" })
      }
    }
    // A pick already replaced the input's files; a drop that brought nothing it
    // takes changes nothing. Rejections come second, so their message outlasts the change's.
    const changed = source === "picker" || accepted.length > 0
    if (changed) onFilesChange?.(accepted, { source })
    if (rejected.length > 0) onFilesReject?.(rejected, { source })
    const input = inputRef.current
    if (!input) return
    if (files !== undefined) setInputFiles(input, files)
    else if (changed && (source === "drop" || rejected.length > 0))
      setInputFiles(input, accepted)
  }

  // Shows the integrated drop zone while files are dragged anywhere over the
  // window. Counted, since every element the drag crosses sends its own dragenter and dragleave.
  const watchWindow = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || variantName !== "integrated" || disabled) return
      let depth = 0
      const enter = (event: DragEvent) => {
        if (!hasFiles(event.dataTransfer)) return
        depth += 1
        setDragging(true)
      }
      const leave = (event: DragEvent) => {
        if (!hasFiles(event.dataTransfer)) return
        depth = Math.max(0, depth - 1)
        if (depth === 0) setDragging(false)
      }
      const end = () => {
        depth = 0
        setDragging(false)
      }
      window.addEventListener("dragenter", enter)
      window.addEventListener("dragleave", leave)
      window.addEventListener("drop", end)
      window.addEventListener("dragend", end)
      return () => {
        window.removeEventListener("dragenter", enter)
        window.removeEventListener("dragleave", leave)
        window.removeEventListener("drop", end)
        window.removeEventListener("dragend", end)
        setDragging(false)
      }
    },
    [variantName, disabled]
  )

  const rootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setRef(ref, node)
      const cleanup = watchWindow(node)
      return () => {
        cleanup?.()
        setRef(ref, null)
      }
    },
    [ref, watchWindow]
  )

  const isDragging = dragging && !disabled

  return (
    <FileSelectorContext.Provider
      value={{
        variant: variantName,
        inputId,
        name,
        accept,
        multiple,
        disabled,
        required,
        form,
        dragging: isDragging,
        setInputRef,
        receive,
      }}
    >
      <div
        ref={rootRef}
        data-slot="file-selector"
        data-variant={variantName}
        data-disabled={disabled || undefined}
        data-dragging={isDragging || undefined}
        className={cn(fileSelectorVariants({ variant }), className)}
        {...props}
      />
    </FileSelectorContext.Provider>
  )
}

const dropzoneVariants = cva(
  "group/file-selector-dropzone rounded-(--radius-2) border border-dashed border-border-strong p-1 data-drag-over:border-2 data-drag-over:border-solid data-drag-over:border-(--file-selector-border-drag) data-drag-over:outline-none",
  {
    variants: {
      variant: {
        files: "",
        images: "flex content-center justify-center p-4",
        // Invisible behind its container until files are dragged over the
        // window, then over it with its card in the middle.
        integrated:
          "absolute inset-0 -z-1 flex content-center justify-center border-0 opacity-0 data-dragging:z-8000 data-dragging:opacity-100 data-drag-over:bg-(--file-selector-drag-background)",
      },
    },
  }
)

function FileSelectorDropzone({
  className,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...props
}: React.ComponentProps<"div">) {
  const context = useFileSelectorContext("FileSelectorDropzone")
  const [over, setOver] = React.useState(false)
  // dragenter and dragleave fire for every child the drag crosses.
  const depth = React.useRef(0)
  const integrated = context.variant === "integrated"

  // The integrated drop zone takes drops only, so it's hidden from assistive technology.
  return (
    <div
      data-slot="file-selector-dropzone"
      data-drag-over={(over && !context.disabled) || undefined}
      data-dragging={context.dragging || undefined}
      aria-hidden={integrated || undefined}
      className={cn(dropzoneVariants({ variant: context.variant }), className)}
      onDragEnter={(event) => {
        onDragEnter?.(event)
        if (event.defaultPrevented || !hasFiles(event.dataTransfer)) return
        event.preventDefault()
        depth.current += 1
        setOver(true)
      }}
      onDragOver={(event) => {
        onDragOver?.(event)
        if (event.defaultPrevented || !hasFiles(event.dataTransfer)) return
        // Taken over either way, so a disabled drop zone doesn't let the
        // browser open the file instead.
        event.preventDefault()
        event.dataTransfer.dropEffect = context.disabled ? "none" : "copy"
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event)
        if (!hasFiles(event.dataTransfer)) return
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setOver(false)
      }}
      onDrop={(event) => {
        onDrop?.(event)
        if (event.defaultPrevented || !hasFiles(event.dataTransfer)) return
        event.preventDefault()
        depth.current = 0
        setOver(false)
        if (context.disabled) return
        context.receive(Array.from(event.dataTransfer.files), "drop")
      }}
      {...props}
    />
  )
}

function FileSelectorInput({
  className,
  onChange,
  ref,
  ...props
}: Omit<
  React.ComponentProps<"input">,
  "type" | "id" | "name" | "accept" | "multiple" | "disabled" | "required"
>) {
  const context = useFileSelectorContext("FileSelectorInput")
  const { setInputRef } = context

  const inputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      setInputRef(node)
      setRef(ref, node)
      return () => {
        setInputRef(null)
        setRef(ref, null)
      }
    },
    [setInputRef, ref]
  )

  // The integrated drop zone isn't a tab stop: pair it with a files or images
  // selector, or another way to pick.
  return (
    <input
      ref={inputRef}
      type="file"
      data-slot="file-selector-input"
      id={context.inputId}
      name={context.name}
      accept={context.accept}
      multiple={context.multiple}
      disabled={context.disabled}
      required={context.required}
      form={context.form}
      tabIndex={context.variant === "integrated" ? -1 : undefined}
      className={cn("sr-only", className)}
      onChange={(event) => {
        onChange?.(event)
        if (event.defaultPrevented) return
        context.receive(Array.from(event.currentTarget.files ?? []), "picker")
      }}
      {...props}
    />
  )
}

// The body, button and icon read the state of the drop zone's own input, its direct child.
const bodyVariants = cva(
  "group-has-[>[data-slot=file-selector-input]:disabled]/file-selector-dropzone:text-muted-foreground",
  {
    variants: {
      variant: {
        files: "flex items-center",
        images: "text-center",
        integrated:
          "m-auto flex size-48 flex-col content-center items-center justify-center rounded-(--radius-2) border border-(--file-selector-body-border) bg-(--file-selector-body-background) shadow-(--elevation-4)",
      },
    },
  }
)

function FileSelectorBody({
  className,
  ...props
}: React.ComponentProps<"label">) {
  const context = useFileSelectorContext("FileSelectorBody")

  return (
    <label
      data-slot="file-selector-body"
      htmlFor={context.inputId}
      className={cn(bodyVariants({ variant: context.variant }), className)}
      {...props}
    />
  )
}

function FileSelectorButton({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  // The focus ring must outrank the button's hover shadow.
  return (
    <span
      data-slot="file-selector-button"
      className={cn(
        buttonVariants({ variant: "outline" }),
        "group-has-[>[data-slot=file-selector-input]:focus-visible]/file-selector-dropzone:border-transparent! group-has-[>[data-slot=file-selector-input]:focus-visible]/file-selector-dropzone:shadow-(--shadow-focus)!",
        "group-has-[>[data-slot=file-selector-input]:disabled]/file-selector-dropzone:pointer-events-none group-has-[>[data-slot=file-selector-input]:disabled]/file-selector-dropzone:border-disabled-border group-has-[>[data-slot=file-selector-input]:disabled]/file-selector-dropzone:bg-page group-has-[>[data-slot=file-selector-input]:disabled]/file-selector-dropzone:text-disabled",
        className
      )}
      {...props}
    >
      <UploadIcon aria-hidden="true" />
      {children}
    </span>
  )
}

const textVariants = cva("", {
  variants: {
    variant: {
      // Hidden on narrow screens, where nothing is dropped.
      files: "ms-2 me-3 hidden md:block",
      images: "mt-3 hidden md:block",
      integrated:
        "mt-3 text-center text-(length:--file-selector-title-size) leading-(--file-selector-title-line-height)",
    },
  },
})

function FileSelectorText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const context = useFileSelectorContext("FileSelectorText")

  return (
    <span
      data-slot="file-selector-text"
      className={cn(textVariants({ variant: context.variant }), className)}
      {...props}
    />
  )
}

function FileSelectorIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-selector-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex text-(--icon-foreground) [&_svg:not([class*='size-'])]:size-8",
        "group-has-[>[data-slot=file-selector-input]:disabled]/file-selector-dropzone:text-current",
        className
      )}
      {...props}
    >
      {children ?? <UploadIcon />}
    </span>
  )
}

export {
  FileSelector,
  FileSelectorBody,
  FileSelectorButton,
  FileSelectorDropzone,
  FileSelectorIcon,
  FileSelectorInput,
  FileSelectorText,
  fileSelectorVariants,
  type FileSelectorChangeDetails,
  type FileSelectorRejection,
  type FileSelectorSource,
}
