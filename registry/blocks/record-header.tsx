"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Icon } from "@/components/wisty/icon"
import {
  formatOutputValue,
  OutputFieldCompactValue,
  type OutputFieldAddress,
  type OutputFieldLinkOptions,
  type OutputFieldName,
  type OutputFieldStyleOptions,
  type OutputFieldType,
} from "@/components/wisty/output-field"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDetail,
  PageHeaderDetailLabel,
  PageHeaderDetails,
  PageHeaderDetailValue,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"

type RecordHeaderFieldType = OutputFieldType | "reference"

/** One field from the compact layout, with how its value reads. */
interface RecordHeaderField
  extends OutputFieldStyleOptions, OutputFieldLinkOptions {
  /** A stable key, like the field's API name: "CloseDate". */
  id: string
  /** The field's label, as the org names it: "Close Date". */
  label: string
  /** The plain value: a percent as a fraction, a date as YYYY-MM-DD, an instant as ISO 8601; null shows blank. */
  value: string | number | boolean | OutputFieldAddress | OutputFieldName | null
  /** How the value reads. Default "text". */
  type?: RecordHeaderFieldType
  /** For a reference, where the related record's name links. */
  href?: string
}

/** One of the record's actions, as a button or a menu item. */
interface RecordHeaderAction {
  /** Identifies the action in onAction: "edit", "clone". */
  value: string
  /** The action's name, in title case: "Change Owner". */
  label: string
  /** Shows the action but doesn't let it run. */
  disabled?: boolean
}

interface RecordHeaderProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The object's icon: "standard:opportunity". */
  icon: React.ComponentProps<typeof Icon>["name"]
  /** The object's label, singular: "Opportunity". */
  objectLabel: string
  /** The record's name. It's the page's h1, and truncates to one line. */
  name: string
  /** The compact layout's fields after the name, in order. Up to six fit. */
  fields?: RecordHeaderField[]
  /** The record's actions, in order. */
  actions?: RecordHeaderAction[]
  /** How many actions show as buttons; the rest go in the menu. Default 3. */
  visibleActions?: number
  /** Runs with the action that's chosen. */
  onAction?: (action: RecordHeaderAction) => void
  /** Whether the user follows the record. */
  following?: boolean
  /** Runs with the new state when Follow is pressed; Follow shows only with this and following. */
  onFollowingChange?: (following: boolean) => void
  /** Holds every slot's size with placeholders while the record loads. */
  loading?: boolean
  /** An ISO 4217 code for currency fields. Default "USD". */
  currency?: string
  /** A BCP 47 locale for numbers and dates. Default "en-US". */
  locale?: string
  /** An IANA time zone for datetime fields. Default "UTC". */
  timeZone?: string
  /** The instant relative fields count from, as ISO 8601. Defaults to the current time at render. */
  now?: string | number | Date
}

function RecordHeader({
  icon,
  objectLabel,
  name,
  fields = [],
  actions = [],
  visibleActions = 3,
  onAction,
  following,
  onFollowingChange,
  loading = false,
  currency = "USD",
  locale = "en-US",
  timeZone = "UTC",
  now,
  className,
  ...props
}: RecordHeaderProps) {
  const buttons = actions.slice(0, visibleActions)
  const menu = actions.slice(visibleActions)
  return (
    <PageHeader
      data-slot="record-header"
      aria-busy={loading || undefined}
      className={className}
      {...props}
    >
      <PageHeaderRow>
        <PageHeaderFigure>
          <Icon name={icon} />
        </PageHeaderFigure>
        <PageHeaderHeading>
          <PageHeaderEyebrow>{objectLabel}</PageHeaderEyebrow>
          {loading ? (
            <Skeleton
              data-loading=""
              className="my-[calc((var(--page-title-line-height)-1)*0.5em)] h-[1em] w-48 max-w-full bg-container text-(length:--page-title-size)"
            />
          ) : (
            <PageHeaderTitle title={name}>{name}</PageHeaderTitle>
          )}
        </PageHeaderHeading>
        <PageHeaderActions>
          {following === undefined || !onFollowingChange ? null : (
            <Button
              variant="outline"
              aria-pressed={following}
              disabled={loading}
              onClick={() => onFollowingChange(!following)}
            >
              {following ? <CheckIcon /> : <PlusIcon />}
              {following ? "Following" : "Follow"}
            </Button>
          )}
          {actions.length > 0 ? (
            <ButtonGroup aria-label={`${objectLabel} actions`}>
              {buttons.map((action) => (
                <Button
                  key={action.value}
                  variant="outline"
                  disabled={loading || action.disabled}
                  onClick={() => onAction?.(action)}
                >
                  {action.label}
                </Button>
              ))}
              {menu.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="More actions"
                    disabled={loading}
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                  >
                    <ChevronDownIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {menu.map((action) => (
                      <DropdownMenuItem
                        key={action.value}
                        disabled={action.disabled}
                        onClick={() => onAction?.(action)}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </ButtonGroup>
          ) : null}
        </PageHeaderActions>
      </PageHeaderRow>
      {fields.length > 0 ? (
        <PageHeaderDetails>
          {fields.map((field) => {
            const type = field.type === "reference" ? "text" : field.type
            // The field passes whole, since the formatter ignores keys it
            // doesn't read. A relative time's title is its date and time.
            const options = { ...field, locale, currency, timeZone, now }
            const title = formatOutputValue(
              field.value,
              type === "relative" ? "datetime" : type,
              options
            )
            return (
              <PageHeaderDetail key={field.id} data-field={field.id}>
                <PageHeaderDetailLabel title={field.label}>
                  {field.label}
                </PageHeaderDetailLabel>
                {loading ? (
                  <PageHeaderDetailValue>
                    <Skeleton
                      data-loading=""
                      className="my-[calc((var(--line-height-base)-1)*0.5em)] h-[1em] w-24 max-w-full bg-container"
                    />
                  </PageHeaderDetailValue>
                ) : (
                  <PageHeaderDetailValue title={title || undefined}>
                    <OutputFieldCompactValue
                      {...options}
                      type={type}
                      value={field.value}
                      href={field.type === "reference" ? field.href : undefined}
                    />
                  </PageHeaderDetailValue>
                )}
              </PageHeaderDetail>
            )
          })}
        </PageHeaderDetails>
      ) : null}
    </PageHeader>
  )
}

export { RecordHeader }
export type {
  RecordHeaderAction,
  RecordHeaderField,
  RecordHeaderFieldType,
  RecordHeaderProps,
}
