# Activity timeline

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/activity-timeline](https://ui.wisty.ai/activity-timeline) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A record's tasks, events, calls and emails in time order, with their details. The Activity tab of a record page.

```bash
npx shadcn@latest add @wisty/activity-timeline
```

## Examples

- `default` (Account activity): Checking a task closes it through `onToggleComplete` and moves it to its month, Delete runs `onAction`, and `expanded` keeps the open call.
- `empty` (No activity): An empty `activities` array: Upcoming & Overdue and the past each say what would show up there.
- `unavailable` (Unavailable): A timeline that couldn't load, from `activities={null}`, says so instead of showing no activity.
- `loading` (Loading): With `loading` and no activities yet, placeholder rows hold the timeline's shape and it's marked busy.

## When to use

- On a record page's Activity tab: the tasks, events, logged calls and emails on a record, like an account, a contact, an opportunity or a case, in time order. It's Lightning's Activity Timeline.
- When people need what's next and overdue at the top, the past by month under it, and each activity's details one click away.
- When people close tasks from the list with a checkbox, or act on an activity from its menu.

## When not to use

- For posts, comments and updates. That's a Chatter feed, not activity.
- For a list of records that aren't tasks, events, calls or emails. Use Related list, or compose Item.
- For a record's stage or status. Use Path.
- For one task or event on its own page. Use Record detail.

## Usage

```tsx
import { ActivityTimeline } from "@/components/wisty/activity-timeline"
```

```tsx
<ActivityTimeline
  activities={activities}
  today="2026-06-15"
  timeZone="America/Chicago"
  onToggleComplete={(id, completed) => saveTask(id, { completed })}
  onAction={(action, activity) => runAction(action.value, activity.id)}
/>
```

Each activity is a plain record. Read them from the record's open activities and activity history, or from Task and Event:

- `type`: `"task"` for a Task, `"call"` and `"email"` for a Task whose TaskSubtype is Call or Email, `"event"` for an Event.
- `when`: a task's ActivityDate as a day (`"2026-06-19"`), or `null` when it has none. For an event, its StartDateTime; for a call or email, when it happened, both as instants (`"2026-06-17T15:00:00Z"`).
- `completed`: the task's IsClosed. `who` is the Name field (WhoId), `related` is Related To (WhatId), `assignee` is Assigned To (OwnerId), and `description` is the Comments, Description or email body.
- `details`: more fields for the expanded row, in order: Call Result for a call, Location for an event, From Address and To Address for an email.

Open tasks, and events from `today` on, show under Upcoming & Overdue, soonest first. Completed tasks, earlier events, calls and emails show under their month, newest first. Pass `expanded` and `onExpandedChange` to keep the open rows yourself; `defaultExpanded` opens some at first.

## Rules

- Pass `onToggleComplete` to let people close tasks. Without it, every task's checkbox is disabled: it shows whether the task is done, but nothing can change it.
- Pass `null` to `activities` when they couldn't load, never `[]`: an empty array says there's no activity.
- Pass a task's due date as a day, never as midnight in some time zone. An instant would move to the day before for people west of UTC.
- Pass `today` in the same time zone as `timeZone`. Overdue and the split between upcoming and past come from it.
- Keep `type` to what the record is. A call logged as a Task with TaskSubtype Call is `"call"`, not `"task"`, so it has no checkbox.
- Never pass `asChild` or `render`.

## API reference

### ActivityTimeline

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `activities` | `Activity[] \| null` |  | The record's activities, in any order. `null` when they couldn't load. |
| `today`? | `string` |  | Today, a day: "2026-06-15". Splits upcoming from past and marks overdue tasks. Default today in `timeZone`. |
| `expanded`? | `string[]` |  | The ids of the rows showing their details. Controlled. |
| `defaultExpanded`? | `string[]` | `[]` | The ids of the rows showing their details at first. |
| `onExpandedChange`? | `(expanded: string[]) => void` |  |  |
| `onToggleComplete`? | `(activityId: string, completed: boolean) => void` |  | Called with the new state when a task's checkbox changes. Without it, the checkbox is read-only. |
| `onAction`? | `(action: ActivityAction, activity: Activity) => void` |  | Called with the action picked from an activity's menu, and the activity. |
| `loading`? | `boolean` | `false` | Draws placeholder rows until the activities load, or marks the timeline busy over the ones it has. |
| `locale`? | `string` | `"en-US"` | A BCP 47 locale for dates. Default "en-US". |
| `timeZone`? | `string` | `"UTC"` | An IANA time zone for the instants of events, calls and emails. Default "UTC". |

Also takes every [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) prop.

### ActivityType

```ts
type ActivityType = "task" | "event" | "call" | "email"
```

### ActivityLink

A record an activity points at, like a contact or an account.

| Member | Type | Default |
| --- | --- | --- |
| `name` | `string` |  |
| `href`? | `string` |  |

### ActivityField

A field in an activity's details, like Call Result.

| Member | Type | Default |
| --- | --- | --- |
| `label` | `string` |  |
| `value` | `string` |  |

### ActivityAction

An item in an activity's actions menu.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Identifies the action in onAction: "edit", "delete". |
| `label` | `string` |  | The item's text. |
| `disabled`? | `boolean` |  | Shows the item but doesn't let it run. |

### TaskActivity

A task: its date is a due day, and it can be completed.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"task"` |  |  |
| `when` | `string \| null` |  | The due date (ActivityDate), a day: "2026-06-18". `null` when it has none. |
| `completed`? | `boolean` |  | The task is closed (IsClosed). |
| `id` | `string` |  | The Task or Event Id. |
| `subject` | `string` |  | The Subject. |
| `href`? | `string` |  | The activity's page. Links the subject. |
| `who`? | `ActivityLink` |  | The Name field (WhoId): the contact or lead. |
| `related`? | `ActivityLink` |  | The Related To field (WhatId): the account, opportunity or case. |
| `assignee`? | `ActivityLink` |  | The Assigned To field (OwnerId): the user. |
| `description`? | `string` |  | The Comments of a task or call, the Description of an event, the body of an email. |
| `details`? | `ActivityField[]` |  | More fields for the details, in order: Call Result, Location, To Address. |
| `actions`? | `ActivityAction[]` |  | The row's menu. |

### TimedActivity

An event, logged call or email: its date is an instant.

| Member | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"event" \| "call" \| "email"` |  |  |
| `when` | `string` |  | When it starts or happened, an ISO instant: "2026-06-17T15:00:00Z". |
| `id` | `string` |  | The Task or Event Id. |
| `subject` | `string` |  | The Subject. |
| `href`? | `string` |  | The activity's page. Links the subject. |
| `who`? | `ActivityLink` |  | The Name field (WhoId): the contact or lead. |
| `related`? | `ActivityLink` |  | The Related To field (WhatId): the account, opportunity or case. |
| `assignee`? | `ActivityLink` |  | The Assigned To field (OwnerId): the user. |
| `description`? | `string` |  | The Comments of a task or call, the Description of an event, the body of an email. |
| `details`? | `ActivityField[]` |  | More fields for the details, in order: Call Result, Location, To Address. |
| `actions`? | `ActivityAction[]` |  | The row's menu. |

### Activity

```ts
type Activity = TaskActivity | TimedActivity
```

## Accessibility

- Each part is a level 2 heading over a list. Each activity is a list item whose subject is a level 3 heading, after the type's name ("Task", "Call").
- Each row's toggle is "Toggle details for" its subject, with `aria-expanded`. The menu is "Show actions for" its subject.
- A task's checkbox is "Mark … complete" with its subject.
- An overdue date is red, and screen readers hear "Overdue:" before it.
- While `loading`, the timeline is busy and its placeholders are hidden from screen readers.
- The names in the line under a subject are underlined, so they don't rely on color alone. In Lightning Blue, the labels and links in an open row's details, and the date on a hovered row, are 4.15:1 to 4.17:1, below WCAG AA's 4.5:1, as in SLDS's own timeline.

## Responsive behavior

- The timeline takes its container's width. The subject truncates at three quarters of the row, with its full text on hover, so the date and menu always fit.
- The details lay their fields out two to a row and truncate each value; the description wraps.

## Example code

### Account activity

Checking a task closes it through `onToggleComplete` and moves it to its month, Delete runs `onAction`, and `expanded` keeps the open call.

```tsx
"use client"

import { useState } from "react"

import {
  ActivityTimeline,
  type Activity,
} from "@/components/wisty/activity-timeline"
import {
  activityTimelineToday,
  edgeActivities,
} from "@/components/wisty/activity-timeline-data"

export default function ActivityTimelineDefault() {
  const [activities, setActivities] = useState<Activity[]>(edgeActivities)
  const [expanded, setExpanded] = useState<string[]>(["00TDn00000EdgeC01"])

  return (
    <ActivityTimeline
      activities={activities}
      today={activityTimelineToday}
      timeZone="America/Chicago"
      expanded={expanded}
      onExpandedChange={setExpanded}
      onToggleComplete={(id, completed) =>
        setActivities((current) =>
          current.map((activity) =>
            activity.id === id && activity.type === "task"
              ? { ...activity, completed }
              : activity
          )
        )
      }
      onAction={(action, activity) => {
        if (action.value === "delete")
          setActivities((current) =>
            current.filter((other) => other.id !== activity.id)
          )
      }}
      className="w-full max-w-2xl"
    />
  )
}
```

### No activity

An empty `activities` array: Upcoming & Overdue and the past each say what would show up there.

```tsx
import { ActivityTimeline } from "@/components/wisty/activity-timeline"

export default function ActivityTimelineEmpty() {
  return (
    <ActivityTimeline
      activities={[]}
      today="2026-06-15"
      className="w-full max-w-2xl"
    />
  )
}
```

### Unavailable

A timeline that couldn't load, from `activities={null}`, says so instead of showing no activity.

```tsx
import { ActivityTimeline } from "@/components/wisty/activity-timeline"

export default function ActivityTimelineUnavailable() {
  return (
    <ActivityTimeline
      activities={null}
      today="2026-06-15"
      className="w-full max-w-2xl"
    />
  )
}
```

### Loading

With `loading` and no activities yet, placeholder rows hold the timeline's shape and it's marked busy.

```tsx
import { ActivityTimeline } from "@/components/wisty/activity-timeline"

export default function ActivityTimelineLoading() {
  return (
    <ActivityTimeline
      loading
      activities={null}
      today="2026-06-15"
      className="w-full max-w-2xl"
    />
  )
}
```
