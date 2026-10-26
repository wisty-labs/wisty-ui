import type { LookupRecord } from "@/components/wisty/lookup"
import type { RecordFormErrors } from "@/components/wisty/record-form"
import { recordFormAccounts } from "@/components/wisty/record-form-data"
import type {
  RecordInlineEditFields,
  RecordInlineEditValues,
} from "@/components/wisty/record-inline-edit"

const owner: LookupRecord = { id: "005A", name: "Jordan Lee" }

// Opportunity's fields on its standard layout; Owner and Expected Revenue aren't editable inline.
export const recordInlineEditFields: RecordInlineEditFields = {
  OwnerId: {
    label: "Opportunity Owner",
    type: "lookup",
    icon: "standard:user",
    href: (record) => `#user-${record.id}`,
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
  Name: {
    label: "Opportunity Name",
    type: "text",
    required: true,
    maxLength: 120,
  },
  CloseDate: { label: "Close Date", type: "date", required: true },
  AccountId: {
    label: "Account Name",
    type: "lookup",
    records: recordFormAccounts,
    icon: "standard:account",
    placeholder: "Search Accounts...",
    href: (record) => `#account-${record.id}`,
  },
  NextStep: { label: "Next Step", type: "text", maxLength: 255 },
  Type: {
    label: "Type",
    type: "picklist",
    options: [
      {
        value: "Existing Customer - Upgrade",
        label: "Existing Customer - Upgrade",
      },
      {
        value: "Existing Customer - Replacement",
        label: "Existing Customer - Replacement",
      },
      {
        value: "Existing Customer - Downgrade",
        label: "Existing Customer - Downgrade",
      },
      { value: "New Customer", label: "New Customer" },
    ],
  },
  StageName: {
    label: "Stage",
    type: "picklist",
    required: true,
    options: [
      { value: "Prospecting", label: "Prospecting" },
      { value: "Qualification", label: "Qualification" },
      { value: "Needs Analysis", label: "Needs Analysis" },
      { value: "Value Proposition", label: "Value Proposition" },
      { value: "Id. Decision Makers", label: "Id. Decision Makers" },
      { value: "Perception Analysis", label: "Perception Analysis" },
      { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
      { value: "Negotiation/Review", label: "Negotiation/Review" },
      { value: "Closed Won", label: "Closed Won" },
      { value: "Closed Lost", label: "Closed Lost" },
    ],
  },
  LeadSource: {
    label: "Lead Source",
    type: "picklist",
    options: [
      { value: "Web", label: "Web" },
      { value: "Phone Inquiry", label: "Phone Inquiry" },
      { value: "Partner Referral", label: "Partner Referral" },
      { value: "Purchased List", label: "Purchased List" },
      { value: "Other", label: "Other" },
    ],
  },
  Probability: {
    label: "Probability (%)",
    type: "percent",
    scale: 0,
    helpText: "How likely the deal is to close. The stage sets it.",
  },
  OrderNumber__c: { label: "Order Number", type: "text", maxLength: 8 },
  MainCompetitors__c: {
    label: "Main Competitor(s)",
    type: "text",
    maxLength: 100,
  },
  CurrentGenerators__c: {
    label: "Current Generator(s)",
    type: "text",
    maxLength: 100,
  },
  DeliveryInstallationStatus__c: {
    label: "Delivery/Installation Status",
    type: "picklist",
    options: [
      { value: "In progress", label: "In progress" },
      { value: "Yet to begin", label: "Yet to begin" },
      { value: "Completed", label: "Completed" },
    ],
  },
  InstallationStart__c: { label: "Installation Start", type: "datetime" },
  TrackingNumber__c: { label: "Tracking Number", type: "text", maxLength: 40 },
  Description: { label: "Description", type: "textarea", maxLength: 32000 },
  LastModifiedDate: {
    label: "Last Modified Date",
    type: "datetime",
    editable: false,
  },
}

// The record's values: a lookup's is its record, a percent a fraction, an empty field null.
export const recordInlineEditOpportunity: RecordInlineEditValues = {
  OwnerId: owner,
  Amount: 75000,
  IsPrivate: false,
  ExpectedRevenue: 56250,
  Name: "Edge Emergency Generator",
  CloseDate: "2026-11-20",
  AccountId: recordFormAccounts[2],
  NextStep: "Send the revised quote",
  Type: "Existing Customer - Upgrade",
  StageName: "Proposal/Price Quote",
  LeadSource: "Partner Referral",
  Probability: 0.75,
  OrderNumber__c: "00047181",
  MainCompetitors__c: "Generac, Kohler",
  CurrentGenerators__c: "Two 500 kW diesel units",
  DeliveryInstallationStatus__c: "Yet to begin",
  InstallationStart__c: "2026-12-01T15:00:00.000Z",
  TrackingNumber__c: "1Z 999 AA1 01 2345 6784",
  Description:
    "Backup power for the Austin data center.\nSite survey done on September 30.",
  LastModifiedDate: "2026-10-09T16:42:00Z",
}

// The same deal after a save that broke a validation rule and the account lookup's filter.
export const recordInlineEditOpportunityFailed: RecordInlineEditValues = {
  ...recordInlineEditOpportunity,
  NextStep: null,
}

export const recordInlineEditOpportunityErrors: RecordFormErrors = {
  form: "Enter a Next Step for opportunities at Proposal/Price Quote or later.",
  fields: {
    AccountId: "Value does not exist or does not match filter criteria.",
  },
}
