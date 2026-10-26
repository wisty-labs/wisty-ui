import type { RecordHeaderProps } from "@/components/wisty/record-header"

export const recordHeaderFixture: RecordHeaderProps = {
  icon: "standard:opportunity",
  objectLabel: "Opportunity",
  name: "Edge Emergency Generator",
  following: false,
  currency: "USD",
  locale: "en-US",
  timeZone: "America/New_York",
  fields: [
    {
      id: "AccountId",
      label: "Account Name",
      value: "Edge Communications",
      type: "reference",
      href: "#001-edge-communications",
    },
    { id: "CloseDate", label: "Close Date", value: "2027-01-18", type: "date" },
    { id: "Amount", label: "Amount", value: 75_000, type: "currency" },
    { id: "StageName", label: "Stage", value: "Id. Decision Makers" },
    {
      id: "OwnerId",
      label: "Opportunity Owner",
      value: "Ellen Hart",
      type: "reference",
      href: "#005-ellen-hart",
    },
  ],
  actions: [
    { value: "edit", label: "Edit" },
    { value: "new-note", label: "New Note" },
    { value: "clone", label: "Clone" },
    { value: "change-owner", label: "Change Owner" },
    { value: "submit-for-approval", label: "Submit for Approval" },
    { value: "delete", label: "Delete" },
  ],
}

// A case on the same account: its name is its number, Date/Time Opened a datetime.
export const recordHeaderCaseFixture: RecordHeaderProps = {
  icon: "standard:case",
  objectLabel: "Case",
  name: "00001026",
  following: true,
  locale: "en-US",
  timeZone: "America/New_York",
  fields: [
    { id: "Priority", label: "Priority", value: "High" },
    { id: "Status", label: "Status", value: "Escalated" },
    {
      id: "ContactId",
      label: "Contact Name",
      value: "Rose Gonzalez",
      type: "reference",
      href: "#003-rose-gonzalez",
    },
    {
      id: "CreatedDate",
      label: "Date/Time Opened",
      value: "2026-10-08T14:32:00Z",
      type: "datetime",
    },
    {
      id: "OwnerId",
      label: "Case Owner",
      value: "Tier 2 Support",
      type: "reference",
      href: "#00G-tier-2-support",
    },
  ],
  actions: [
    { value: "edit", label: "Edit" },
    { value: "change-owner", label: "Change Owner" },
    { value: "close-case", label: "Close Case" },
    { value: "delete", label: "Delete" },
  ],
}

// An opportunity with a long name and no amount or close date yet.
export const recordHeaderPartialFixture: RecordHeaderProps = {
  ...recordHeaderFixture,
  name: "United Oil & Gas Corp. - Refinery Emergency Generators, Phase II Installation and Service Agreement",
  fields: [
    {
      id: "AccountId",
      label: "Account Name",
      value: "United Oil & Gas Corp.",
      type: "reference",
      href: "#001-united-oil-gas",
    },
    { id: "CloseDate", label: "Close Date", value: null, type: "date" },
    { id: "Amount", label: "Amount", value: null, type: "currency" },
    { id: "StageName", label: "Stage", value: "Prospecting" },
    {
      id: "OwnerId",
      label: "Opportunity Owner",
      value: "Ellen Hart",
      type: "reference",
      href: "#005-ellen-hart",
    },
  ],
}

// Edge Communications, with Last Modified Date relative to a fixed now.
export const recordHeaderAccountFixture: RecordHeaderProps = {
  icon: "standard:account",
  objectLabel: "Account",
  name: "Edge Communications",
  following: false,
  locale: "en-US",
  timeZone: "America/New_York",
  now: "2026-10-13T15:00:00Z",
  fields: [
    { id: "Type", label: "Type", value: "Customer - Direct" },
    {
      id: "Phone",
      label: "Phone",
      value: "(512) 757-6000",
      type: "phone",
    },
    {
      id: "BillingAddress",
      label: "Billing Address",
      value: {
        street: "312 Constitution Place",
        city: "Austin",
        state: "TX",
        postalCode: "78767",
        country: "USA",
      },
      type: "address",
    },
    {
      id: "OwnerId",
      label: "Account Owner",
      value: "Jordan Lee",
      type: "reference",
      href: "#005-jordan-lee",
    },
    {
      id: "LastModifiedDate",
      label: "Last Modified Date",
      value: "2026-10-13T12:00:00Z",
      type: "relative",
    },
  ],
  actions: [
    { value: "edit", label: "Edit" },
    { value: "new-contact", label: "New Contact" },
    { value: "new-opportunity", label: "New Opportunity" },
    { value: "delete", label: "Delete" },
  ],
}
