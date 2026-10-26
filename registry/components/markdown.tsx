import * as React from "react"
import { CheckIcon } from "lucide-react"
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingTag = `h${HeadingLevel}`

const headingSizes: Record<HeadingTag, string> = {
  h1: "text-(length:--markdown-h1-size) font-normal",
  h2: "text-(length:--markdown-h2-size) font-normal",
  h3: "text-(length:--markdown-h3-size) font-normal",
  h4: "text-(length:--markdown-h4-size) font-normal",
  h5: "text-(length:--markdown-h5-size) font-semibold",
  h6: "text-(length:--markdown-h6-size) font-semibold",
}

// Renders `shift` levels lower, never past h6, styled as the level it renders as.
function heading(level: HeadingLevel, shift: number) {
  const Tag = `h${Math.min(6, level + shift)}` as HeadingTag
  return function MarkdownHeading({
    node: _node,
    className,
    ...props
  }: React.ComponentProps<"h1"> & ExtraProps) {
    return (
      <Tag
        className={cn(
          "pt-3 pb-1 leading-tight text-heading",
          headingSizes[Tag],
          className
        )}
        {...props}
      />
    )
  }
}

// One set per headingLevel, made once, so a re-render with new text keeps
// the same renderers.
const headings = Object.fromEntries(
  ([1, 2, 3, 4, 5, 6] as const).map((headingLevel) => [
    headingLevel,
    Object.fromEntries(
      ([1, 2, 3, 4, 5, 6] as const).map((level) => [
        `h${level}`,
        heading(level, headingLevel - 1),
      ])
    ) as Components,
  ])
) as Record<HeadingLevel, Components>

// A task's checkbox has no label of its own, so the item names it.
function MarkdownListItem({
  node: _node,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & ExtraProps) {
  const id = React.useId()
  const task = className?.split(" ").includes("task-list-item") ?? false
  return (
    <li
      id={task ? id : undefined}
      className={cn(
        "ps-0.5 [&.task-list-item]:relative [&.task-list-item]:ps-4",
        className
      )}
      {...props}
    >
      {task
        ? React.Children.map(children, (child) =>
            React.isValidElement<React.ComponentProps<"input">>(child) &&
            child.props.type === "checkbox"
              ? React.cloneElement(child, { "aria-labelledby": id })
              : child
          )
        : children}
    </li>
  )
}

const isExternal = (href: string | undefined) =>
  href !== undefined && /^(https?:)?\/\//i.test(href)

const elements: Components = {
  p: ({ node: _node, className, ...props }) => (
    <p
      className={cn(
        "leading-6 [&:has(+:is(p,ul,ol,blockquote,div))]:mb-2",
        className
      )}
      {...props}
    />
  ),
  strong: ({ node: _node, className, ...props }) => (
    <strong className={cn("font-bold", className)} {...props} />
  ),
  del: ({ node: _node, className, ...props }) => (
    <del
      className={cn(
        "line-through [color:color-mix(in_srgb,currentColor,transparent_40%)]",
        className
      )}
      {...props}
    />
  ),
  a: ({ node: _node, className, href, rel, children, ...props }) =>
    href ? (
      <a
        className={cn(
          "text-link underline transition-colors duration-100 ease-linear hover:text-link-hover focus-visible:text-link-hover focus-visible:outline-(--focus)",
          className
        )}
        href={href}
        rel={isExternal(href) ? "noopener noreferrer" : rel}
        {...props}
      >
        {children}
      </a>
    ) : (
      <>{children}</>
    ),
  ul: ({ node: _node, className, ...props }) => (
    <ul
      className={cn(
        "ms-[1.125rem] mb-1 list-disc leading-5 [&.contains-task-list]:ms-0 [&.contains-task-list]:list-none",
        className
      )}
      {...props}
    />
  ),
  ol: ({ node: _node, className, ...props }) => (
    <ol
      className={cn("ms-[1.125rem] mb-1 list-decimal leading-5", className)}
      {...props}
    />
  ),
  li: MarkdownListItem,
  input: ({ node: _node, className, type, ...props }) =>
    type === "checkbox" ? (
      <span className="absolute start-0 top-1 inline-flex size-3.5">
        <input
          type="checkbox"
          className={cn(
            "peer m-0 size-full appearance-none rounded-(--radius-1) border border-(color:--markdown-task-border)",
            className
          )}
          {...props}
        />
        <CheckIcon
          aria-hidden="true"
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto hidden size-3.5 text-(--markdown-foreground) peer-checked:block"
        />
      </span>
    ) : (
      <input type={type} className={className} {...props} />
    ),
  blockquote: ({ node: _node, className, ...props }) => (
    <blockquote
      className={cn(
        "relative ms-5 me-10 mb-2 before:absolute before:inset-y-0 before:-start-5 before:w-1 before:rounded-(--radius-1) before:bg-(--markdown-divider) [&>p:has(+blockquote)]:mb-2",
        className
      )}
      {...props}
    />
  ),
  code: ({ node: _node, className, ...props }) => (
    <code
      className={cn(
        "rounded-(--radius-1) border border-(color:--markdown-code-border) bg-(--markdown-surface) px-1 py-[calc(0.25rem-1px)] font-mono text-(length:--markdown-code-size)",
        className
      )}
      {...props}
    />
  ),
  pre: ({ node: _node, className, ...props }) => (
    <pre
      className={cn(
        "mb-2 overflow-x-auto rounded-(--radius-2) border border-(color:--markdown-code-border) bg-(--markdown-surface) px-4 py-3 [&>code]:rounded-(--radius-2) [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:break-normal [&>code]:whitespace-pre",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className }) => (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a rule is a separator on both bases; Radix's is decorative unless told.
    <Separator role="separator" className={cn("my-3", className)} />
  ),
  img: ({ node: _node, className, alt, ...props }) => (
    <img
      alt={alt ?? ""}
      className={cn(
        "inline-block h-auto max-w-full rounded-(--radius-2) align-middle",
        className
      )}
      {...props}
    />
  ),
  table: ({ node: _node, className, ...props }) => (
    <Table
      className={cn(
        "mb-2 w-auto border-(color:--markdown-table-border) bg-transparent text-inherit [--table-border-inline:var(--markdown-table-border)] [--table-radius:var(--radius-2)]",
        className
      )}
      {...props}
    />
  ),
  thead: ({ node: _node, className, ...props }) => (
    <TableHeader
      className={cn(
        "[&_th]:border-(color:--markdown-table-border) [&_th]:bg-(--markdown-surface) [&_th]:leading-[inherit] [&_th]:font-bold [&_th]:text-inherit [&_th+th]:border-s",
        className
      )}
      {...props}
    />
  ),
  tbody: ({ node: _node, className, ...props }) => (
    <TableBody
      className={cn("[&>tr+tr>*]:border-(color:--markdown-divider)", className)}
      {...props}
    />
  ),
  tr: ({ node: _node, className, ...props }) => (
    <TableRow
      className={cn(
        "in-data-[slot=table-body]:not-data-[state=selected]:hover:bg-transparent in-data-[slot=table-body]:hover:*:shadow-none in-data-[slot=table-body]:hover:[&+tr>*]:border-t-(color:--markdown-divider)",
        className
      )}
      {...props}
    />
  ),
  th: ({ node: _node, className, ...props }) => (
    <TableHead
      className={cn("px-3 py-1 whitespace-normal", className)}
      {...props}
    />
  ),
  td: ({ node: _node, className, ...props }) => (
    <TableCell
      className={cn(
        "px-3 py-1 whitespace-normal has-[code:first-child]:ps-2 has-[code:last-child]:pe-2",
        className
      )}
      {...props}
    />
  ),
}

const remarkPlugins = [remarkGfm]

type MarkdownProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The markdown source. An empty or blank string renders nothing. */
  children: string
  /** Renderers replacing the built-in ones, as react-markdown's; a replaced heading isn't shifted. */
  components?: Components
  /** The level a markdown `#` heading renders as. Deeper ones follow, up to h6. */
  headingLevel?: HeadingLevel
}

function Markdown({
  children,
  components,
  headingLevel = 2,
  className,
  ...props
}: MarkdownProps) {
  if (children.trim() === "") return null
  return (
    <div
      data-slot="markdown"
      className={cn(
        "text-(length:--font-size-base) leading-(--line-height-base) text-(--markdown-foreground) wrap-break-word [&>ol]:mb-2 [&>ul]:mb-2",
        className
      )}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={{ ...elements, ...headings[headingLevel], ...components }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export { Markdown }
export type { MarkdownProps }
