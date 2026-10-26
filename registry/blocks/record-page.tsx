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
