# Record page

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/record-page](https://ui.wisty.ai/record-page) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

A record page for a standard or custom object, with its header, tabs and sidebar. A page file you edit, with no props.

```bash
npx shadcn@latest add @wisty/record-page
```

## Examples

- `default` (Account): Edge Communications: Follow and its actions in the header, Contacts and Opportunities on the Related tab, and its figures and Cases beside them.
- `opportunity` (Opportunity): Edge Emergency Generator with Path under the header, its Products and Contact Roles on the Related tab, and its Stage History beside them.

## When to use

- For a record's page in an app, on any object: an account with its contacts and cases, an opportunity with its path and products, a case, or a custom object's record.
- When you want Lightning's record page as a starting point you own: install it, copy the example nearest your object into your page, and add, move or remove a section by its lines.
- When the app reads one record, its layouts and its related lists, and passes each section plain values.

## When not to use

- For a list of records. Use List view.
- For one part of a record page on its own. Use Record header, Record detail, Record inline edit, Related list or Activity timeline.
- For the page's regions without the sections. Use Page regions.

## Usage

```tsx
import { RecordPage } from "@/components/wisty/record-page"
```

```tsx
<RecordPage />
```

The install writes the Account page, `record-page.tsx`, and its fixtures, `record-page-data.ts`, beside it. `RecordPage` takes no props: the page file is what you edit. Swap the fixture import for the app's data and change the JSX. It is Page regions' Header and Right Sidebar: Record header on top, a card of Related, Details and Activity tabs in the main region, KPI row and Cases as tiles in the sidebar. The Opportunity example is the same page for another object: Path under the header, Products and Contact Roles on the Related tab, Stage History beside them. For a case or a custom object, copy the example nearest it and change the lines that name the object: the icon, the object label, the columns and the lists. Wire each section's handlers (`onAction`, `onRowAction`, `onEdit`, `onToggleComplete`) to the app's saves; Follow and a task's checkbox are page state in the examples.

## Rules

- Pass `null` as a list's `records`, or as `activities`, when it couldn't load, never `[]`: an empty array says there are none.
- Pass each count the app knows, never the length of a list it read with a limit. Add `hasMore` when it only knows there are more.
- Pass raw values with a type, `null` for an empty field, and amounts in one currency with `currency` set to match on every section. Each section formats them with `locale`, `currency` and `timeZone`.
- Pass `today` in the same time zone as `timeZone`; overdue tasks and upcoming activity come from it.
- Render one per page: the header's name is the page's h1. Never pass `asChild` or `render`.

## API reference

### RecordPage

Edge Communications' record page: Lightning's Header and Right Sidebar over the account's fixtures.

## SLDS mapping

The page is Lightning's record page on the Header and Right Sidebar template, built from the blocks that draw each part: Record header is the highlights panel; the main region's card holds the Tabs component in Lightning's order, Related (Related list cards), Details (Record detail, the page layout's sections) and Activity (Activity timeline); the sidebar holds KPI row and a Related list as tiles, as a Dynamic Related List shows in a sidebar. Path sits under the header at the page's full width, where Lightning places it.

Known gaps:

- No Chatter, News or activity composer, and no inline edit on the Details tab. For inline edit, swap Record detail for Record inline edit.

## Responsive behavior

- The page follows its own width, not the window's: from 54rem the main region takes two thirds and the sidebar the rest, never narrower than 22rem; below that the sidebar stacks under the main region, as Page regions lays them out.
- Each section sizes itself inside its region: a related list shows tiles below 30rem, the details go to one column below about 584px, and the figures go two by two in the sidebar.

## Example code

### Account

Edge Communications: Follow and its actions in the header, Contacts and Opportunities on the Related tab, and its figures and Cases beside them.

Installing Record page writes these files. The example renders the first.

#### components/wisty/record-page.tsx

```tsx
"use client"

import * as React from "react"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityTimeline } from "@/components/wisty/activity-timeline"
import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { KpiRow } from "@/components/wisty/kpi-row"
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"
import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
import { RecordHeader } from "@/components/wisty/record-header"
import {
  recordPageAccount as account,
  recordPageToday,
  type RecordPageCaseRow,
  type RecordPageContactRow,
  type RecordPageOpportunityRow,
} from "@/components/wisty/record-page-data"
import { RelatedList } from "@/components/wisty/related-list"

const linkClass = "text-link hover:underline focus-visible:underline"

// The org's locale, currency and time zone: the fixtures' days and times are Austin's.
const format = { locale: "en-US", timeZone: "America/Chicago" }
const currency = "USD"

const contact = createDataTableColumnHelper<RecordPageContactRow>()
const contactColumns = contact.columns([
  contact.accessor("name", {
    header: "Contact Name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={row.original.href} className={linkClass}>
        {getValue()}
      </a>
    ),
  }),
  contact.accessor("title", { header: "Title" }),
  contact.accessor("email", { header: "Email", meta: { type: "email" } }),
  contact.accessor("phone", { header: "Phone", meta: { type: "phone" } }),
])

const opportunity = createDataTableColumnHelper<RecordPageOpportunityRow>()
const opportunityColumns = opportunity.columns([
  opportunity.accessor("name", {
    header: "Opportunity Name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={row.original.href} className={linkClass}>
        {getValue()}
      </a>
    ),
  }),
  opportunity.accessor("stage", { header: "Stage" }),
  opportunity.accessor("amount", {
    header: "Amount",
    meta: { type: "currency" },
  }),
  opportunity.accessor("closeDate", {
    header: "Close Date",
    meta: { type: "date" },
  }),
])

const caseColumn = createDataTableColumnHelper<RecordPageCaseRow>()
const caseColumns = caseColumn.columns([
  caseColumn.accessor("caseNumber", {
    header: "Case Number",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={row.original.href} className={linkClass}>
        {getValue()}
      </a>
    ),
  }),
  caseColumn.accessor("subject", { header: "Subject" }),
  caseColumn.accessor("status", { header: "Status" }),
  caseColumn.accessor("priority", { header: "Priority" }),
])

const rowActions = [
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
]

/** Edge Communications' record page: Lightning's Header and Right Sidebar over the account's fixtures. */
function RecordPage() {
  const [following, setFollowing] = React.useState(account.following)
  const [activities, setActivities] = React.useState(account.activities)

  return (
    <Page>
      <RecordHeader
        icon="standard:account"
        objectLabel="Account"
        name={account.name}
        fields={account.highlights}
        actions={account.actions}
        following={following}
        onFollowingChange={setFollowing}
        currency={currency}
        {...format}
      />
      <PageRegions layout="right-sidebar">
        <PageRegion>
          <Card className="min-w-0 gap-0 px-(--card-spacing-inline)">
            <Tabs defaultValue="related">
              <TabsList aria-label={account.name}>
                <TabsTrigger value="related">Related</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="related" className="flex flex-col gap-4">
                <RelatedList
                  title="Contacts"
                  icon="standard:contact"
                  columns={contactColumns}
                  {...account.contacts}
                  actions={[
                    { value: "new", label: "New", ariaLabel: "New Contact" },
                  ]}
                  rowActions={rowActions}
                  currency={currency}
                  {...format}
                />
                <RelatedList
                  title="Opportunities"
                  icon="standard:opportunity"
                  columns={opportunityColumns}
                  {...account.opportunities}
                  actions={[
                    {
                      value: "new",
                      label: "New",
                      ariaLabel: "New Opportunity",
                    },
                  ]}
                  rowActions={rowActions}
                  currency={currency}
                  {...format}
                />
              </TabsContent>
              <TabsContent value="details">
                <RecordDetail
                  fields={account.fields}
                  values={account.values}
                  currency={currency}
                  {...format}
                >
                  <RecordDetailSection title="Account Information">
                    <RecordDetailField name="OwnerId" />
                    <RecordDetailField name="Rating" />
                    <RecordDetailField name="Name" />
                    <RecordDetailField name="Phone" />
                    <RecordDetailField name="ParentId" />
                    <RecordDetailField name="Fax" />
                    <RecordDetailField name="AccountNumber" />
                    <RecordDetailField name="Website" />
                    <RecordDetailField name="Site" />
                    <RecordDetailField name="TickerSymbol" />
                    <RecordDetailField name="Type" />
                    <RecordDetailField name="Ownership" />
                    <RecordDetailField name="Industry" />
                    <RecordDetailField name="NumberOfEmployees" />
                    <RecordDetailField name="AnnualRevenue" />
                    <RecordDetailField name="Sic" />
                  </RecordDetailSection>
                  <RecordDetailSection title="Additional Information">
                    <RecordDetailField name="CustomerPriority__c" />
                    <RecordDetailField name="SLA__c" />
                    <RecordDetailField name="SLAExpirationDate__c" />
                    <RecordDetailField name="SLASerialNumber__c" />
                    <RecordDetailField name="NumberofLocations__c" />
                    <RecordDetailField name="UpsellOpportunity__c" />
                    <RecordDetailField name="Active__c" />
                    <RecordDetailField name="Description" />
                  </RecordDetailSection>
                  <RecordDetailSection title="System Information">
                    <RecordDetailField name="CreatedDate" />
                    <RecordDetailField name="LastModifiedDate" />
                  </RecordDetailSection>
                </RecordDetail>
              </TabsContent>
              <TabsContent value="activity">
                <ActivityTimeline
                  activities={activities}
                  today={recordPageToday}
                  onToggleComplete={(id, completed) =>
                    setActivities((current) =>
                      current.map((activity) =>
                        activity.id === id && activity.type === "task"
                          ? { ...activity, completed }
                          : activity
                      )
                    )
                  }
                  {...format}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </PageRegion>
        <PageRegion>
          <KpiRow
            metrics={account.metrics}
            comparison={account.comparison}
            aria-label={`${account.name} key metrics`}
            currency={currency}
            locale={format.locale}
          />
          <RelatedList
            title="Cases"
            icon="standard:case"
            variant="tiles"
            columns={caseColumns}
            {...account.cases}
            actions={[{ value: "new", label: "New", ariaLabel: "New Case" }]}
            rowActions={rowActions}
            currency={currency}
            {...format}
          />
        </PageRegion>
      </PageRegions>
    </Page>
  )
}

export { RecordPage }
```

#### components/wisty/record-page-data.ts

```ts
import type { Activity } from "@/components/wisty/activity-timeline"
import type { KpiRowMetric } from "@/components/wisty/kpi-row"
import type { LookupRecord } from "@/components/wisty/lookup"
import type {
  RecordDetailFields,
  RecordDetailValues,
} from "@/components/wisty/record-detail"
import type {
  RecordHeaderAction,
  RecordHeaderField,
} from "@/components/wisty/record-header"
import type {
  RelatedListProps,
  RelatedListRecord,
} from "@/components/wisty/related-list"

/** A related list's first records and what the app knows about their count, as Related list takes them. */
type RelatedRecords<TRecord extends RelatedListRecord> = Pick<
  RelatedListProps<TRecord>,
  "records" | "count" | "hasMore" | "href"
>

/** A row of an account's Contacts related list. */
export interface RecordPageContactRow {
  /** The contact's Id. */
  id: string
  /** The contact's name, linked to its record page. */
  name: string
  /** The contact's title, or null. */
  title: string | null
  /** The contact's email, or null. */
  email: string | null
  /** The contact's phone, or null. */
  phone: string | null
  /** The contact's record page. */
  href: string
}

/** A row of an account's Opportunities related list. */
export interface RecordPageOpportunityRow {
  /** The opportunity's Id. */
  id: string
  /** The opportunity's name, linked to its record page. */
  name: string
  /** The stage, as labeled. */
  stage: string
  /** In the page's currency, or null. */
  amount: number | null
  /** A day, YYYY-MM-DD. */
  closeDate: string
  /** The opportunity's record page. */
  href: string
}

/** A row of an account's Cases related list. */
export interface RecordPageCaseRow {
  /** The case's Id. */
  id: string
  /** The case number, linked to its record page. */
  caseNumber: string
  /** The subject, or null. */
  subject: string | null
  /** The status, as labeled. */
  status: string
  /** The priority, as labeled, or null. */
  priority: string | null
  /** The case's record page. */
  href: string
}

/** A row of an opportunity's Products related list: one line item. */
export interface RecordPageProductRow {
  /** The line item's Id. */
  id: string
  /** The product's name, linked to its record page. */
  name: string
  /** How many of the product. */
  quantity: number
  /** The sales price of one, in the page's currency, or null. */
  unitPrice: number | null
  /** Quantity times sales price, in the page's currency, or null. */
  totalPrice: number | null
  /** The product's record page. */
  href: string
}

/** A row of an opportunity's Contact Roles related list. */
export interface RecordPageContactRoleRow {
  /** The contact role's Id. */
  id: string
  /** The contact's name, linked to its record page. */
  name: string
  /** The role, as labeled, or null. */
  role: string | null
  /** Whether this is the opportunity's primary contact. */
  primary: boolean
  /** The contact's record page. */
  href: string
}

/** A row of an opportunity's Stage History related list. */
export interface RecordPageStageChangeRow {
  /** The history entry's Id. */
  id: string
  /** The stage the opportunity moved to, as labeled. */
  stage: string
  /** The amount at the time, in the page's currency, or null. */
  amount: number | null
  /** The probability at the time, as a fraction, or null. */
  probability: number | null
  /** The close date at the time, a day, YYYY-MM-DD. */
  closeDate: string
}

/** The day the pages are read on, in the org's time zone. */
export const recordPageToday = "2026-06-15"

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
const ellenRecord: LookupRecord = { id: "005Dn00000EllenH", name: ellen.name }
const edgeRecord: LookupRecord = { id: "001Dn00000EdgeCOM", name: edge.name }

const accountHighlights: RecordHeaderField[] = [
  { id: "Type", label: "Type", value: "Customer - Direct" },
  { id: "Phone", label: "Phone", value: "(512) 757-6000", type: "phone" },
  {
    id: "Website",
    label: "Website",
    value: "www.edgecomm.example",
    type: "url",
  },
  {
    id: "OwnerId",
    label: "Account Owner",
    value: ellen.name,
    href: ellen.href,
    type: "reference",
  },
  { id: "Industry", label: "Industry", value: "Electronics" },
]

// Account's fields on its page layout; the owner and the system dates aren't editable.
const accountFields: RecordDetailFields = {
  OwnerId: {
    label: "Account Owner",
    type: "lookup",
    href: (record) => `/users/${record.id}`,
    editable: false,
  },
  Rating: { label: "Rating", type: "text" },
  Name: { label: "Account Name", type: "text" },
  Phone: { label: "Phone", type: "phone" },
  ParentId: {
    label: "Parent Account",
    type: "lookup",
    href: (record) => `/accounts/${record.id}`,
  },
  Fax: { label: "Fax", type: "phone" },
  AccountNumber: { label: "Account Number", type: "text" },
  Website: { label: "Website", type: "url" },
  Site: { label: "Account Site", type: "text" },
  TickerSymbol: { label: "Ticker Symbol", type: "text" },
  Type: { label: "Type", type: "text" },
  Ownership: { label: "Ownership", type: "text" },
  Industry: { label: "Industry", type: "text" },
  NumberOfEmployees: { label: "Employees", type: "number" },
  AnnualRevenue: { label: "Annual Revenue", type: "currency", scale: 0 },
  Sic: { label: "SIC Code", type: "text" },
  CustomerPriority__c: { label: "Customer Priority", type: "text" },
  SLA__c: { label: "SLA", type: "text" },
  SLAExpirationDate__c: { label: "SLA Expiration Date", type: "date" },
  SLASerialNumber__c: { label: "SLA Serial Number", type: "text" },
  NumberofLocations__c: { label: "Number of Locations", type: "number" },
  UpsellOpportunity__c: { label: "Upsell Opportunity", type: "text" },
  Active__c: { label: "Active", type: "text" },
  Description: { label: "Description", type: "textarea" },
  CreatedDate: { label: "Created Date", type: "datetime", editable: false },
  LastModifiedDate: {
    label: "Last Modified Date",
    type: "datetime",
    editable: false,
  },
}

const accountValues: RecordDetailValues = {
  OwnerId: ellenRecord,
  Rating: "Hot",
  Name: edge.name,
  Phone: "(512) 757-6000",
  ParentId: null,
  Fax: "(512) 757-9000",
  AccountNumber: "CD451796",
  Website: "www.edgecomm.example",
  Site: null,
  TickerSymbol: "EDGE",
  Type: "Customer - Direct",
  Ownership: "Public",
  Industry: "Electronics",
  NumberOfEmployees: 1000,
  AnnualRevenue: 139_000_000,
  Sic: "6576",
  CustomerPriority__c: "Medium",
  SLA__c: "Silver",
  SLAExpirationDate__c: "2027-01-31",
  SLASerialNumber__c: "2657",
  NumberofLocations__c: 2,
  UpsellOpportunity__c: "Maybe",
  Active__c: "Yes",
  Description: null,
  CreatedDate: "2024-03-14T16:20:00Z",
  LastModifiedDate: "2026-06-12T14:05:00Z",
}

const accountActions: RecordHeaderAction[] = [
  { value: "edit", label: "Edit" },
  { value: "new-contact", label: "New Contact" },
  { value: "new-opportunity", label: "New Opportunity" },
  { value: "new-case", label: "New Case" },
  { value: "change-owner", label: "Change Owner" },
  { value: "delete", label: "Delete" },
]

const contacts: RecordPageContactRow[] = [
  {
    id: "003Dn00000EdgeRG1",
    name: rose.name,
    title: "SVP, Procurement",
    email: "rose@edgecomm.example",
    phone: "(512) 757-6000",
    href: rose.href,
  },
  {
    id: "003Dn00000EdgeSF1",
    name: sean.name,
    title: "CFO",
    email: "sean@edgecomm.example",
    phone: "(512) 757-6000",
    href: sean.href,
  },
]

const opportunities: RecordPageOpportunityRow[] = [
  {
    id: "006Dn00000EdgeEG1",
    name: generator.name,
    stage: "Id. Decision Makers",
    amount: 75_000,
    closeDate: "2026-11-20",
    href: generator.href,
  },
  {
    id: "006Dn00000EdgeIN1",
    name: "Edge Installation",
    stage: "Closed Won",
    amount: 50_000,
    closeDate: "2026-05-28",
    href: "/opportunities/006Dn00000EdgeIN1",
  },
  {
    id: "006Dn00000EdgeSL1",
    name: "Edge SLA",
    stage: "Closed Won",
    amount: 60_000,
    closeDate: "2026-03-12",
    href: "/opportunities/006Dn00000EdgeSL1",
  },
  {
    id: "006Dn00000EdgeSG1",
    name: "Edge Standby Generator",
    stage: "Closed Lost",
    amount: 40_000,
    closeDate: "2026-02-20",
    href: "/opportunities/006Dn00000EdgeSG1",
  },
]

const cases: RecordPageCaseRow[] = [
  {
    id: "500Dn00000Edge026",
    caseNumber: "00001026",
    subject: "Starting generator after electrical failure",
    status: "Escalated",
    priority: "High",
    href: "/cases/500Dn00000Edge026",
  },
  {
    id: "500Dn00000Edge027",
    caseNumber: "00001027",
    subject: "Seeking guidance on electrical wiring installation for GC5060",
    status: "New",
    priority: "Medium",
    href: "/cases/500Dn00000Edge027",
  },
]

/** The account's year to date against last year. The figures agree with its lists. */
const accountMetrics: KpiRowMetric[] = [
  {
    id: "open-pipeline",
    label: "Open pipeline",
    value: 75_000,
    previous: 60_000,
  },
  {
    id: "closed-won",
    label: "Closed won",
    value: 110_000,
    previous: 95_000,
  },
  {
    id: "win-rate",
    label: "Win rate",
    value: 2 / 3,
    previous: 0.5,
    format: { style: "percent", maximumFractionDigits: 0 },
  },
  {
    id: "open-cases",
    label: "Open cases",
    value: 2,
    previous: 3,
    format: { style: "decimal" },
    isIncreasePositive: false,
  },
]

const taskActions = [
  { value: "edit-comments", label: "Edit Comments" },
  { value: "change-date", label: "Change Date" },
  { value: "delete", label: "Delete" },
]
const loggedActions = [
  { value: "edit-comments", label: "Edit Comments" },
  { value: "delete", label: "Delete" },
]

const activities: Activity[] = [
  {
    id: "00TDn00000EdgeT01",
    type: "task",
    subject: "Send the revised generator quote",
    href: "/tasks/00TDn00000EdgeT01",
    when: "2026-06-12",
    who: rose,
    related: generator,
    assignee: ellen,
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
    details: [{ label: "Location", value: "Edge Communications, Austin, TX" }],
    actions: [
      { value: "edit", label: "Edit" },
      { value: "delete", label: "Delete" },
    ],
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
      "Rose confirmed the 200 kW unit. She wants installation before the end of July.",
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
]

/** Edge Communications, as its record page opens on June 15, 2026 in Austin: one key per section of the page. */
export const recordPageAccount = {
  name: edge.name,
  highlights: accountHighlights,
  fields: accountFields,
  values: accountValues,
  actions: accountActions,
  following: false,
  metrics: accountMetrics,
  comparison: "last year",
  contacts: {
    records: contacts,
    count: 2,
    href: `${edge.href}/contacts`,
  } satisfies RelatedRecords<RecordPageContactRow>,
  opportunities: {
    records: opportunities,
    count: 4,
    href: `${edge.href}/opportunities`,
  } satisfies RelatedRecords<RecordPageOpportunityRow>,
  cases: {
    records: cases,
    count: 2,
    href: `${edge.href}/cases`,
  } satisfies RelatedRecords<RecordPageCaseRow>,
  activities,
}

const stages = [
  "Prospecting",
  "Qualification",
  "Needs Analysis",
  "Value Proposition",
  "Id. Decision Makers",
  "Perception Analysis",
  "Proposal/Price Quote",
  "Negotiation/Review",
  "Closed",
].map((stage) => ({ value: stage, label: stage }))

const opportunityHighlights: RecordHeaderField[] = [
  {
    id: "AccountId",
    label: "Account Name",
    value: edge.name,
    href: edge.href,
    type: "reference",
  },
  { id: "CloseDate", label: "Close Date", value: "2026-11-20", type: "date" },
  { id: "Amount", label: "Amount", value: 75_000, type: "currency" },
  { id: "StageName", label: "Stage", value: "Id. Decision Makers" },
  {
    id: "OwnerId",
    label: "Opportunity Owner",
    value: ellen.name,
    href: ellen.href,
    type: "reference",
  },
]

// Opportunity's fields on its page layout; the owner, Expected Revenue and the system dates aren't editable.
const opportunityFields: RecordDetailFields = {
  OwnerId: {
    label: "Opportunity Owner",
    type: "lookup",
    href: (record) => `/users/${record.id}`,
    editable: false,
  },
  Amount: { label: "Amount", type: "currency", scale: 2 },
  IsPrivate: { label: "Private", type: "boolean" },
  ExpectedRevenue: {
    label: "Expected Revenue",
    type: "currency",
    scale: 2,
    editable: false,
  },
  Name: { label: "Opportunity Name", type: "text" },
  CloseDate: { label: "Close Date", type: "date" },
  AccountId: {
    label: "Account Name",
    type: "lookup",
    href: (record) => `/accounts/${record.id}`,
  },
  NextStep: { label: "Next Step", type: "text" },
  Type: { label: "Type", type: "text" },
  StageName: { label: "Stage", type: "text" },
  LeadSource: { label: "Lead Source", type: "text" },
  Probability: {
    label: "Probability (%)",
    type: "percent",
    scale: 0,
    helpText: "How likely the deal is to close. The stage sets it.",
  },
  OrderNumber__c: { label: "Order Number", type: "text" },
  MainCompetitors__c: { label: "Main Competitor(s)", type: "text" },
  CurrentGenerators__c: { label: "Current Generator(s)", type: "text" },
  DeliveryInstallationStatus__c: {
    label: "Delivery/Installation Status",
    type: "text",
  },
  TrackingNumber__c: { label: "Tracking Number", type: "text" },
  Description: { label: "Description", type: "textarea" },
  CreatedDate: { label: "Created Date", type: "datetime", editable: false },
  LastModifiedDate: {
    label: "Last Modified Date",
    type: "datetime",
    editable: false,
  },
}

const opportunityValues: RecordDetailValues = {
  OwnerId: ellenRecord,
  Amount: 75_000,
  IsPrivate: false,
  ExpectedRevenue: 45_000,
  Name: generator.name,
  CloseDate: "2026-11-20",
  AccountId: edgeRecord,
  NextStep: "Send the revised quote",
  Type: "Existing Customer - Upgrade",
  StageName: "Id. Decision Makers",
  LeadSource: "Partner Referral",
  Probability: 0.6,
  OrderNumber__c: "00047181",
  MainCompetitors__c: "Generac, Kohler",
  CurrentGenerators__c: "Two 500 kW diesel units",
  DeliveryInstallationStatus__c: "Yet to begin",
  TrackingNumber__c: null,
  Description:
    "Backup power for the Austin data center.\nSite survey done on June 5.",
  CreatedDate: "2026-03-02T15:10:00Z",
  LastModifiedDate: "2026-06-12T14:05:00Z",
}

const opportunityActions: RecordHeaderAction[] = [
  { value: "edit", label: "Edit" },
  { value: "new-note", label: "New Note" },
  { value: "clone", label: "Clone" },
  { value: "change-owner", label: "Change Owner" },
  { value: "submit-for-approval", label: "Submit for Approval" },
  { value: "delete", label: "Delete" },
]

const products: RecordPageProductRow[] = [
  {
    id: "00kDn00000EdgeL01",
    name: "GenWatt Diesel 200kW",
    quantity: 2,
    unitPrice: 25_000,
    totalPrice: 50_000,
    href: "/products/01tDn00000Diesel200",
  },
  {
    id: "00kDn00000EdgeL02",
    name: "Installation: Industrial - High",
    quantity: 1,
    unitPrice: 25_000,
    totalPrice: 25_000,
    href: "/products/01tDn00000InstHigh",
  },
]

const contactRoles: RecordPageContactRoleRow[] = [
  {
    id: "00KDn00000EdgeR01",
    name: rose.name,
    role: "Decision Maker",
    primary: true,
    href: rose.href,
  },
  {
    id: "00KDn00000EdgeR02",
    name: sean.name,
    role: "Economic Buyer",
    primary: false,
    href: sean.href,
  },
]

const stageHistory: RecordPageStageChangeRow[] = [
  {
    id: "008Dn00000EdgeH05",
    stage: "Id. Decision Makers",
    amount: 75_000,
    probability: 0.6,
    closeDate: "2026-11-20",
  },
  {
    id: "008Dn00000EdgeH04",
    stage: "Value Proposition",
    amount: 75_000,
    probability: 0.5,
    closeDate: "2026-11-20",
  },
  {
    id: "008Dn00000EdgeH03",
    stage: "Needs Analysis",
    amount: 75_000,
    probability: 0.2,
    closeDate: "2026-10-30",
  },
  {
    id: "008Dn00000EdgeH02",
    stage: "Qualification",
    amount: 60_000,
    probability: 0.1,
    closeDate: "2026-10-30",
  },
  {
    id: "008Dn00000EdgeH01",
    stage: "Prospecting",
    amount: 60_000,
    probability: 0.1,
    closeDate: "2026-10-30",
  },
]

/** Edge Emergency Generator, the account's open opportunity, at Id. Decision Makers on the same day. */
export const recordPageOpportunity = {
  name: generator.name,
  highlights: opportunityHighlights,
  fields: opportunityFields,
  values: opportunityValues,
  actions: opportunityActions,
  following: false,
  stages,
  stage: "Id. Decision Makers",
  products: {
    records: products,
    count: 2,
    href: `${generator.href}/products`,
  } satisfies RelatedRecords<RecordPageProductRow>,
  contactRoles: {
    records: contactRoles,
    count: 2,
    href: `${generator.href}/contact-roles`,
  } satisfies RelatedRecords<RecordPageContactRoleRow>,
  stageHistory: {
    records: stageHistory,
    count: 5,
    href: `${generator.href}/history`,
  } satisfies RelatedRecords<RecordPageStageChangeRow>,
  activities: activities.filter(
    (activity) => activity.related?.href === generator.href
  ),
}
```

### Opportunity

Edge Emergency Generator with Path under the header, its Products and Contact Roles on the Related tab, and its Stage History beside them.

```tsx
"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityTimeline } from "@/components/wisty/activity-timeline"
import { createDataTableColumnHelper } from "@/components/wisty/data-table"
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"
import { Path } from "@/components/wisty/path"
import {
  RecordDetail,
  RecordDetailField,
  RecordDetailSection,
} from "@/components/wisty/record-detail"
import { RecordHeader } from "@/components/wisty/record-header"
import {
  recordPageOpportunity as opportunity,
  recordPageToday,
  type RecordPageContactRoleRow,
  type RecordPageProductRow,
  type RecordPageStageChangeRow,
} from "@/components/wisty/record-page-data"
import { RelatedList } from "@/components/wisty/related-list"

const linkClass = "text-link hover:underline focus-visible:underline"
const format = { locale: "en-US", timeZone: "America/Chicago" }
const currency = "USD"

const product = createDataTableColumnHelper<RecordPageProductRow>()
const productColumns = product.columns([
  product.accessor("name", {
    header: "Product",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={row.original.href} className={linkClass}>
        {getValue()}
      </a>
    ),
  }),
  product.accessor("quantity", {
    header: "Quantity",
    meta: { type: "number" },
  }),
  product.accessor("unitPrice", {
    header: "Sales Price",
    meta: { type: "currency" },
  }),
  product.accessor("totalPrice", {
    header: "Total Price",
    meta: { type: "currency" },
  }),
])

const role = createDataTableColumnHelper<RecordPageContactRoleRow>()
const roleColumns = role.columns([
  role.accessor("name", {
    header: "Contact Name",
    meta: { rowHeader: true },
    cell: ({ row, getValue }) => (
      <a href={row.original.href} className={linkClass}>
        {getValue()}
      </a>
    ),
  }),
  role.accessor("role", { header: "Role" }),
  role.accessor("primary", { header: "Primary", meta: { type: "boolean" } }),
])

const change = createDataTableColumnHelper<RecordPageStageChangeRow>()
const stageColumns = change.columns([
  change.accessor("stage", { header: "Stage", meta: { rowHeader: true } }),
  change.accessor("amount", { header: "Amount", meta: { type: "currency" } }),
  change.accessor("probability", {
    header: "Probability (%)",
    meta: { type: "percent" },
  }),
  change.accessor("closeDate", {
    header: "Close Date",
    meta: { type: "date" },
  }),
])

export default function RecordPageOpportunity() {
  const [following, setFollowing] = useState(opportunity.following)
  const [activities, setActivities] = useState(opportunity.activities)
  const [current, setCurrent] = useState(opportunity.stage)
  const [selected, setSelected] = useState(opportunity.stage)
  const next =
    opportunity.stages[
      opportunity.stages.findIndex((stage) => stage.value === current) + 1
    ]

  return (
    <Page>
      <RecordHeader
        icon="standard:opportunity"
        objectLabel="Opportunity"
        name={opportunity.name}
        fields={opportunity.highlights}
        actions={opportunity.actions}
        following={following}
        onFollowingChange={setFollowing}
        currency={currency}
        {...format}
      />
      <Path
        aria-label="Stage"
        steps={opportunity.stages}
        current={current}
        value={selected}
        onValueChange={setSelected}
      >
        {selected === current ? (
          <Button
            disabled={!next}
            onClick={() => {
              if (!next) return
              setCurrent(next.value)
              setSelected(next.value)
            }}
          >
            <CheckIcon />
            Mark Stage as Complete
          </Button>
        ) : (
          <Button onClick={() => setCurrent(selected)}>
            Mark as Current Stage
          </Button>
        )}
      </Path>
      <PageRegions layout="right-sidebar">
        <PageRegion>
          <Card className="min-w-0 gap-0 px-(--card-spacing-inline)">
            <Tabs defaultValue="related">
              <TabsList aria-label={opportunity.name}>
                <TabsTrigger value="related">Related</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="related" className="flex flex-col gap-4">
                <RelatedList
                  title="Products"
                  icon="standard:product"
                  columns={productColumns}
                  {...opportunity.products}
                  actions={[{ value: "add", label: "Add Products" }]}
                  currency={currency}
                  {...format}
                />
                <RelatedList
                  title="Contact Roles"
                  icon="standard:contact"
                  columns={roleColumns}
                  {...opportunity.contactRoles}
                  actions={[{ value: "add", label: "Add Contact Roles" }]}
                  {...format}
                />
              </TabsContent>
              <TabsContent value="details">
                <RecordDetail
                  fields={opportunity.fields}
                  values={opportunity.values}
                  currency={currency}
                  {...format}
                >
                  <RecordDetailSection title="Opportunity Information">
                    <RecordDetailField name="OwnerId" />
                    <RecordDetailField name="Amount" />
                    <RecordDetailField name="IsPrivate" />
                    <RecordDetailField name="ExpectedRevenue" />
                    <RecordDetailField name="Name" />
                    <RecordDetailField name="CloseDate" />
                    <RecordDetailField name="AccountId" />
                    <RecordDetailField name="NextStep" />
                    <RecordDetailField name="Type" />
                    <RecordDetailField name="StageName" />
                    <RecordDetailField name="LeadSource" />
                    <RecordDetailField name="Probability" />
                  </RecordDetailSection>
                  <RecordDetailSection title="Additional Information">
                    <RecordDetailField name="OrderNumber__c" />
                    <RecordDetailField name="MainCompetitors__c" />
                    <RecordDetailField name="CurrentGenerators__c" />
                    <RecordDetailField name="DeliveryInstallationStatus__c" />
                    <RecordDetailField name="TrackingNumber__c" />
                    <RecordDetailField name="Description" />
                  </RecordDetailSection>
                  <RecordDetailSection title="System Information">
                    <RecordDetailField name="CreatedDate" />
                    <RecordDetailField name="LastModifiedDate" />
                  </RecordDetailSection>
                </RecordDetail>
              </TabsContent>
              <TabsContent value="activity">
                <ActivityTimeline
                  activities={activities}
                  today={recordPageToday}
                  onToggleComplete={(id, completed) =>
                    setActivities((current) =>
                      current.map((activity) =>
                        activity.id === id && activity.type === "task"
                          ? { ...activity, completed }
                          : activity
                      )
                    )
                  }
                  {...format}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </PageRegion>
        <PageRegion>
          <RelatedList
            title="Stage History"
            icon="standard:opportunity"
            variant="tiles"
            columns={stageColumns}
            {...opportunity.stageHistory}
            currency={currency}
            {...format}
          />
        </PageRegion>
      </PageRegions>
    </Page>
  )
}
```
