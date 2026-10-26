import type { Activity } from "@/components/wisty/activity-timeline"

/** The day the Activity tab is read on. */
export const activityTimelineToday = "2026-06-15"

const ellen = { name: "Ellen Hart", href: "/users/005Dn00000EllenH" }
const rose = { name: "Rose Gonzalez", href: "/contacts/003Dn00000EdgeRG1" }
const sean = { name: "Sean Forbes", href: "/contacts/003Dn00000EdgeSF1" }
const edge = {
  name: "Edge Communications",
  href: "/accounts/001Dn00000EdgeCOM",
}
const generator = {
  name: "Edge Emergency Generator",
  href: "/opportunities/006Dn00000EdgeEG1",
}

const taskActions = [
  { value: "edit-comments", label: "Edit Comments" },
  { value: "change-date", label: "Change Date" },
  { value: "follow-up-task", label: "Create Follow-Up Task" },
  { value: "delete", label: "Delete" },
]
const eventActions = [
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
]
const loggedActions = [
  { value: "edit-comments", label: "Edit Comments" },
  { value: "delete", label: "Delete" },
]

/** Edge Communications' open and past activities around that day. */
export const edgeActivities: Activity[] = [
  {
    id: "00TDn00000EdgeT01",
    type: "task",
    subject: "Send the revised generator quote",
    href: "/tasks/00TDn00000EdgeT01",
    when: "2026-06-12",
    who: rose,
    related: generator,
    assignee: ellen,
    description: "Rose asked for the 50 kW unit priced with installation.",
    details: [{ label: "Priority", value: "High" }],
    actions: taskActions,
  },
  {
    id: "00UDn00000EdgeE01",
    type: "event",
    subject: "Installation planning meeting",
    href: "/events/00UDn00000EdgeE01",
    when: "2026-06-17T15:00:00Z",
    who: sean,
    related: edge,
    assignee: ellen,
    description: "Walk the site plan with Sean and the facilities team.",
    details: [{ label: "Location", value: "Edge Communications, Austin, TX" }],
    actions: eventActions,
  },
  {
    id: "00TDn00000EdgeT02",
    type: "task",
    subject: "Confirm the delivery window",
    href: "/tasks/00TDn00000EdgeT02",
    when: "2026-06-19",
    who: rose,
    related: generator,
    assignee: ellen,
    actions: taskActions,
  },
  {
    id: "00TDn00000EdgeC01",
    type: "call",
    subject: "Generator sizing call",
    href: "/tasks/00TDn00000EdgeC01",
    when: "2026-06-11T16:30:00Z",
    who: rose,
    related: generator,
    assignee: ellen,
    description:
      "Rose confirmed the 50 kW unit. She wants installation before the end of July.",
    details: [{ label: "Call Result", value: "Reached decision maker" }],
    actions: loggedActions,
  },
  {
    id: "00TDn00000EdgeM01",
    type: "email",
    subject: "Edge Emergency Generator: proposal",
    href: "/tasks/00TDn00000EdgeM01",
    when: "2026-06-09T13:05:00Z",
    who: rose,
    related: generator,
    assignee: ellen,
    description:
      "Hi Rose, the proposal for the emergency generator is attached. Happy to walk through it this week.",
    details: [
      { label: "From Address", value: "ellen.hart@example.com" },
      { label: "To Address", value: "rose@edgecomm.example" },
    ],
    actions: loggedActions,
  },
  {
    id: "00TDn00000EdgeT03",
    type: "task",
    subject: "Send the site survey form",
    href: "/tasks/00TDn00000EdgeT03",
    when: "2026-06-05",
    completed: true,
    who: sean,
    related: edge,
    assignee: ellen,
    actions: taskActions,
  },
  {
    id: "00UDn00000EdgeE02",
    type: "event",
    subject: "Quarterly business review",
    href: "/events/00UDn00000EdgeE02",
    when: "2026-05-28T17:00:00Z",
    who: sean,
    related: edge,
    assignee: ellen,
    actions: eventActions,
  },
]
