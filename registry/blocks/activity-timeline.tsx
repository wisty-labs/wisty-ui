"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ExpandableSection,
  ExpandableSectionContent,
  ExpandableSectionTrigger,
} from "@/components/wisty/expandable-section"
import { Icon } from "@/components/wisty/icon"

type ActivityType = "task" | "event" | "call" | "email"

/** A record an activity points at, like a contact or an account. */
interface ActivityLink {
  name: string
  href?: string
}

/** A field in an activity's details, like Call Result. */
interface ActivityField {
  label: string
  value: string
}

/** An item in an activity's actions menu. */
interface ActivityAction {
  /** Identifies the action in onAction: "edit", "delete". */
  value: string
  /** The item's text. */
  label: string
  /** Shows the item but doesn't let it run. */
  disabled?: boolean
}

interface ActivityBase {
  /** The Task or Event Id. */
  id: string
  /** The Subject. */
  subject: string
  /** The activity's page. Links the subject. */
  href?: string
  /** The Name field (WhoId): the contact or lead. */
  who?: ActivityLink
  /** The Related To field (WhatId): the account, opportunity or case. */
  related?: ActivityLink
  /** The Assigned To field (OwnerId): the user. */
  assignee?: ActivityLink
  /** The Comments of a task or call, the Description of an event, the body of an email. */
  description?: string
  /** More fields for the details, in order: Call Result, Location, To Address. */
  details?: ActivityField[]
  /** The row's menu. */
  actions?: ActivityAction[]
}

/** A task: its date is a due day, and it can be completed. */
interface TaskActivity extends ActivityBase {
  type: "task"
  /** The due date (ActivityDate), a day: "2026-06-18". `null` when it has none. */
  when: string | null
  /** The task is closed (IsClosed). */
  completed?: boolean
}

/** An event, logged call or email: its date is an instant. */
interface TimedActivity extends ActivityBase {
  type: "event" | "call" | "email"
  /** When it starts or happened, an ISO instant: "2026-06-17T15:00:00Z". */
  when: string
}

type Activity = TaskActivity | TimedActivity

interface ActivityTimelineProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The record's activities, in any order. `null` when they couldn't load. */
  activities: Activity[] | null
  /** Today, a day: "2026-06-15". Splits upcoming from past and marks overdue tasks. Default today in `timeZone`. */
  today?: string
  /** The ids of the rows showing their details. Controlled. */
  expanded?: string[]
  /** The ids of the rows showing their details at first. */
  defaultExpanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  /** Called with the new state when a task's checkbox changes. Without it, the checkbox is read-only. */
  onToggleComplete?: (activityId: string, completed: boolean) => void
  /** Called with the action picked from an activity's menu, and the activity. */
  onAction?: (action: ActivityAction, activity: Activity) => void
  /** Draws placeholder rows until the activities load, or marks the timeline busy over the ones it has. */
  loading?: boolean
  /** A BCP 47 locale for dates. Default "en-US". */
  locale?: string
  /** An IANA time zone for the instants of events, calls and emails. Default "UTC". */
  timeZone?: string
}

const typeLabel: Record<ActivityType, string> = {
  task: "Task",
  event: "Event",
  call: "Call",
  email: "Email",
}

const typeIcon = {
  task: "standard:task",
  event: "standard:event",
  call: "standard:log_a_call",
  email: "standard:email",
} as const

const lineColor: Record<ActivityType, string> = {
  task: "before:bg-(--timeline-task)",
  event: "before:bg-(--timeline-event)",
  call: "before:bg-(--timeline-call)",
  email: "before:bg-(--timeline-email)",
}

// Zero-padded parts of an instant in a time zone, so they compare as text.
function partsIn(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00"
  const day = `${part("year")}-${part("month")}-${part("day")}`
  return { day, time: `${part("hour")}:${part("minute")}:${part("second")}` }
}

// A day as midnight UTC, formatted in UTC, so it never shifts.
function utcDay(day: string) {
  const [y = 0, m = 1, d = 1] = day.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

interface Placed {
  activity: Activity
  /** The calendar day it falls on, in the time zone; null with no date. */
  day: string | null
  /** Sorts as text: the day, then the time for an instant. */
  key: string
  upcoming: boolean
  overdue: boolean
}

function place(activity: Activity, today: string, timeZone: string): Placed {
  if (activity.type === "task") {
    const day = activity.when ? activity.when.slice(0, 10) : null
    const open = !activity.completed
    return {
      activity,
      day,
      key: day ?? "",
      upcoming: open,
      overdue: open && day !== null && day < today,
    }
  }
  const instant = new Date(activity.when)
  // An instant that doesn't parse shows no date, under "No date".
  if (Number.isNaN(instant.getTime()))
    return { activity, day: null, key: "", upcoming: false, overdue: false }
  const { day, time } = partsIn(instant, timeZone)
  return {
    activity,
    day,
    key: `${day}T${time}`,
    upcoming: activity.type === "event" && day >= today,
    overdue: false,
  }
}

function summaryVerb({ activity, upcoming, overdue }: Placed) {
  switch (activity.type) {
    case "task":
      return activity.completed
        ? "had a task"
        : overdue
          ? "has an overdue task"
          : "has an upcoming task"
    case "event":
      return upcoming ? "has an upcoming event" : "had an event"
    case "call":
      return "logged a call"
    case "email":
      return "sent an email"
  }
}

const linkClass = "text-link hover:underline focus-visible:underline"

// A link inside a sentence is underlined, so it doesn't rely on color alone.
function LinkOrText({
  link,
  inline = false,
}: {
  link: ActivityLink
  inline?: boolean
}) {
  return link.href !== undefined ? (
    <a href={link.href} className={cn(linkClass, inline && "underline")}>
      {link.name}
    </a>
  ) : (
    <>{link.name}</>
  )
}

interface Format {
  date: (placed: Placed) => React.ReactNode
  month: (month: string) => string
}

function useFormat(locale: string, timeZone: string, today: string): Format {
  return React.useMemo(() => {
    const thisYear = today.slice(0, 4)
    // The year shows only outside today's year.
    const day = (value: string) =>
      new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: value.slice(0, 4) === thisYear ? undefined : "numeric",
      }).format(utcDay(value))
    const time = new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
    })
    const monthName = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      month: "long",
    })
    return {
      date: (placed) => {
        if (placed.day === null) return null
        if (placed.activity.type === "task") {
          return <time dateTime={placed.day}>{day(placed.day)}</time>
        }
        return (
          <time dateTime={placed.activity.when}>
            {time.format(new Date(placed.activity.when))}
            <span aria-hidden="true"> | </span>
            <span className="sr-only">, </span>
            {day(placed.day)}
          </time>
        )
      },
      month: (month) =>
        `${monthName.format(utcDay(`${month}-01`))} • ${month.slice(0, 4)}`,
    }
  }, [locale, timeZone, today])
}

function TimelineSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    // The root is a flex column, so section margins don't collapse.
    <ExpandableSection
      defaultOpen
      data-slot="activity-timeline-section"
      className="mb-0"
    >
      <ExpandableSectionTrigger>{title}</ExpandableSectionTrigger>
      <ExpandableSectionContent>{children}</ExpandableSectionContent>
    </ExpandableSection>
  )
}

function TimelineEmpty({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 px-2 text-muted-foreground">{children}</p>
}

function TimelineItem({
  placed,
  open,
  onOpenChange,
  format,
  onToggleComplete,
  onAction,
}: {
  placed: Placed
  open: boolean
  onOpenChange: (open: boolean) => void
  format: Format
  onToggleComplete?: ActivityTimelineProps["onToggleComplete"]
  onAction?: ActivityTimelineProps["onAction"]
}) {
  const { activity, overdue } = placed
  const completed = activity.type === "task" && activity.completed === true
  const date = format.date(placed)
  const fields: ActivityField[] = []
  const links: { label: string; link: ActivityLink }[] = []
  if (activity.who) links.push({ label: "Name", link: activity.who })
  if (activity.related)
    links.push({ label: "Related To", link: activity.related })
  fields.push(...(activity.details ?? []))
  const hasDetails =
    links.length > 0 || fields.length > 0 || activity.description

  return (
    <li
      data-slot="activity-timeline-item"
      data-type={activity.type}
      className="list-none"
    >
      {/* The line runs the row's full height, centered under the type icon:
          the toggle, its margin and half the icon. */}
      <Collapsible
        open={open}
        onOpenChange={onOpenChange}
        className={cn(
          "relative pb-4 before:absolute before:inset-y-0 before:start-[calc(2.25rem-1px)] before:w-0.5",
          lineColor[activity.type]
        )}
      >
        <div className="flex items-start">
          <div className="z-1 me-1 flex shrink-0 items-start">
            <CollapsibleTrigger
              aria-label={`Toggle details for ${activity.subject}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-xs" }),
                "me-2 size-4 aria-[expanded=false]:[&>svg]:-rotate-90"
              )}
            >
              <ChevronDownIcon aria-hidden="true" />
            </CollapsibleTrigger>
            <Icon
              name={typeIcon[activity.type]}
              size="small"
              label={typeLabel[activity.type]}
            />
          </div>
          <div className="min-w-0 flex-1 px-1">
            <div className="flex items-center justify-between rounded-(--radius-1) p-1 hover:bg-muted">
              <div className="flex max-w-3/4 min-w-0 items-center">
                {activity.type === "task" ? (
                  <Checkbox
                    className="me-1"
                    checked={completed}
                    disabled={onToggleComplete === undefined}
                    aria-label={`Mark ${activity.subject} complete`}
                    onCheckedChange={(checked) =>
                      onToggleComplete?.(activity.id, checked === true)
                    }
                  />
                ) : null}
                <h3
                  className={cn(
                    "truncate text-(length:--timeline-title-size) font-(--timeline-title-weight)",
                    completed && "line-through"
                  )}
                  title={activity.subject}
                >
                  {activity.href !== undefined ? (
                    <a href={activity.href} className={linkClass}>
                      {activity.subject}
                    </a>
                  ) : (
                    activity.subject
                  )}
                </h3>
              </div>
              <div className="ms-2 flex shrink-0 items-center">
                {date !== null ? (
                  <p
                    data-overdue={overdue || undefined}
                    className={cn(
                      "text-(length:--timeline-date-size) text-muted-foreground",
                      overdue && "text-destructive",
                      activity.actions?.length ? "pe-2" : undefined
                    )}
                  >
                    {overdue ? (
                      <span className="sr-only">Overdue: </span>
                    ) : null}
                    {date}
                  </p>
                ) : null}
                {activity.actions?.length ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Show actions for ${activity.subject}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon-xs" }),
                        "size-5"
                      )}
                    >
                      <ChevronDownIcon aria-hidden="true" className="size-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {activity.actions.map((action) => (
                        <DropdownMenuItem
                          key={action.value}
                          disabled={action.disabled}
                          onClick={() => onAction?.(action, activity)}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            </div>
            {activity.assignee ? (
              <p className="mx-1 text-muted-foreground">
                <LinkOrText link={activity.assignee} inline />{" "}
                {summaryVerb(placed)}
                {activity.who ? (
                  <>
                    {activity.type === "email" ? " to " : " with "}
                    <LinkOrText link={activity.who} inline />
                  </>
                ) : null}
              </p>
            ) : null}
            <CollapsibleContent
              data-slot="activity-timeline-details"
              className="mx-1 mt-2 rounded-(--radius-2) bg-muted p-4 text-foreground"
            >
              {hasDetails ? (
                <>
                  {links.length > 0 || fields.length > 0 ? (
                    <dl className="grid grid-cols-2 gap-x-4">
                      {links.map(({ label, link }) => (
                        <div key={label} className="min-w-0 pb-3">
                          <dt className="pb-2 text-(length:--timeline-date-size) text-muted-foreground">
                            {label}
                          </dt>
                          <dd className="truncate">
                            <LinkOrText link={link} />
                          </dd>
                        </div>
                      ))}
                      {fields.map((field, index) => (
                        <div
                          key={`${field.label}-${index}`}
                          className="min-w-0 pb-3"
                        >
                          <dt className="pb-2 text-(length:--timeline-date-size) text-muted-foreground">
                            {field.label}
                          </dt>
                          <dd className="truncate" title={field.value}>
                            {field.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {activity.description ? (
                    <div>
                      <p className="text-(length:--timeline-date-size) text-muted-foreground">
                        {activity.type === "email"
                          ? "Text Body"
                          : "Description"}
                      </p>
                      <p className="pt-2 whitespace-pre-line">
                        {activity.description}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-muted-foreground">No details to show.</p>
              )}
            </CollapsibleContent>
          </div>
        </div>
      </Collapsible>
    </li>
  )
}

// Placeholder rows while the activities load, hidden from screen readers:
// the timeline says it's busy.
function TimelineLoading() {
  return (
    <div aria-hidden="true" data-slot="activity-timeline-loading">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex items-start gap-1 pb-4 ps-6">
          <Skeleton className="size-6 shrink-0 rounded-(--icon-radius)" />
          <div className="flex min-w-0 flex-1 flex-col gap-2 p-2">
            <Skeleton className="h-2 w-2/5" />
            <Skeleton className="h-2 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Upcoming & Overdue soonest first, a task with no due date last; the past
// newest first, by month, and anything with no date apart.
function arrange(activities: Activity[], today: string, timeZone: string) {
  const placed = activities.map((activity) => place(activity, today, timeZone))
  const upcoming = placed
    .filter((p) => p.upcoming)
    .sort((a, b) =>
      a.day === null || b.day === null
        ? Number(a.day === null) - Number(b.day === null)
        : a.key.localeCompare(b.key)
    )
  const past = placed
    .filter((p) => !p.upcoming)
    .sort((a, b) => b.key.localeCompare(a.key))
  const byMonth = new Map<string, Placed[]>()
  const undated: Placed[] = []
  for (const item of past) {
    if (item.day === null) {
      undated.push(item)
      continue
    }
    const month = item.day.slice(0, 7)
    byMonth.set(month, [...(byMonth.get(month) ?? []), item])
  }
  return { upcoming, months: [...byMonth], undated }
}

function todayIn(timeZone: string) {
  return partsIn(new Date(), timeZone).day
}

function ActivityTimeline({
  activities,
  today: todayProp,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  onToggleComplete,
  onAction,
  loading = false,
  locale = "en-US",
  timeZone = "UTC",
  className,
  ...props
}: ActivityTimelineProps) {
  const today = todayProp ?? todayIn(timeZone)
  const [ownExpanded, setOwnExpanded] = React.useState(defaultExpanded)
  const expanded = expandedProp ?? ownExpanded
  const setExpanded = (next: string[]) => {
    if (expandedProp === undefined) setOwnExpanded(next)
    onExpandedChange?.(next)
  }
  const format = useFormat(locale, timeZone, today)

  const { upcoming, months, undated } = React.useMemo(
    () => arrange(activities ?? [], today, timeZone),
    [activities, today, timeZone]
  )

  const ids = (activities ?? []).map((activity) => activity.id)
  const allOpen = ids.length > 0 && ids.every((id) => expanded.includes(id))
  const waiting = loading && (activities === null || activities.length === 0)
  const unavailable = activities === null && !loading

  const list = (items: Placed[]) => (
    <ul data-slot="activity-timeline-list" className="mb-2">
      {items.map((placed) => (
        <TimelineItem
          key={placed.activity.id}
          placed={placed}
          open={expanded.includes(placed.activity.id)}
          onOpenChange={(open) =>
            setExpanded(
              open
                ? [...expanded, placed.activity.id]
                : expanded.filter((id) => id !== placed.activity.id)
            )
          }
          format={format}
          onToggleComplete={onToggleComplete}
          onAction={onAction}
        />
      ))}
    </ul>
  )

  return (
    <div
      data-slot="activity-timeline"
      aria-busy={loading || undefined}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {waiting ? (
        <TimelineLoading />
      ) : unavailable ? (
        <p className="px-2 text-muted-foreground">
          Activities aren&apos;t available.
        </p>
      ) : (
        <>
          {ids.length > 0 ? (
            <div className="flex justify-end">
              <Button
                variant="link"
                size="sm"
                onClick={() => setExpanded(allOpen ? [] : ids)}
              >
                {allOpen ? "Collapse All" : "Expand All"}
              </Button>
            </div>
          ) : null}
          <TimelineSection title="Upcoming & Overdue">
            {upcoming.length > 0 ? (
              list(upcoming)
            ) : (
              <TimelineEmpty>
                No next steps. To get things moving, add a task or set up a
                meeting.
              </TimelineEmpty>
            )}
          </TimelineSection>
          {months.map(([month, items]) => (
            <TimelineSection key={month} title={format.month(month)}>
              {list(items)}
            </TimelineSection>
          ))}
          {undated.length > 0 ? (
            <TimelineSection title="No date">{list(undated)}</TimelineSection>
          ) : null}
          {months.length === 0 && undated.length === 0 ? (
            <TimelineEmpty>
              No past activity. Past meetings and tasks marked as done show up
              here.
            </TimelineEmpty>
          ) : null}
        </>
      )}
    </div>
  )
}

export { ActivityTimeline }
export type {
  Activity,
  ActivityAction,
  ActivityField,
  ActivityLink,
  ActivityTimelineProps,
  ActivityType,
  TaskActivity,
  TimedActivity,
}
