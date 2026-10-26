import type { LookupRecord } from "@/components/wisty/lookup"
import type {
  RecordDetailFields,
  RecordDetailValues,
} from "@/components/wisty/record-detail"

const jordan: LookupRecord = { id: "jordan-lee", name: "Jordan Lee" }
const edge: LookupRecord = {
  id: "edge-communications",
  name: "Edge Communications",
}

// Opportunity's fields on its page layout; Owner and Expected Revenue aren't editable.
export const recordDetailOpportunityFields: RecordDetailFields = {
  OwnerId: {
    label: "Opportunity Owner",
    type: "lookup",
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
  Name: { label: "Opportunity Name", type: "text" },
  CloseDate: { label: "Close Date", type: "date" },
  AccountId: {
    label: "Account Name",
    type: "lookup",
    href: (record) => `#account-${record.id}`,
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
}

// An opportunity on Edge Communications: a lookup's value is its record, a percent a fraction.
export const recordDetailOpportunity: RecordDetailValues = {
  OwnerId: jordan,
  Amount: 75000,
  IsPrivate: false,
  ExpectedRevenue: 56250,
  Name: "Edge Emergency Generator",
  CloseDate: "2026-11-20",
  AccountId: edge,
  NextStep: "Send the revised quote",
  Type: "Existing Customer - Upgrade",
  StageName: "Proposal/Price Quote",
  LeadSource: "Partner Referral",
  Probability: 0.75,
  OrderNumber__c: "00047181",
  MainCompetitors__c: "Generac, Kohler",
  CurrentGenerators__c: "Two 500 kW diesel units",
  DeliveryInstallationStatus__c: "Yet to begin",
  TrackingNumber__c: "1Z 999 AA1 01 2345 6784",
  Description:
    "Backup power for the Austin data center.\nSite survey done on September 30.",
}

// The same opportunity freshly created: most fields empty in the record.
export const recordDetailNewOpportunity: RecordDetailValues = {
  OwnerId: jordan,
  Amount: null,
  Name: "Edge Emergency Generator",
  CloseDate: "2026-11-20",
  AccountId: edge,
  NextStep: null,
  Type: null,
  StageName: "Prospecting",
  LeadSource: null,
}

// Account's fields, with compound addresses and two system dates.
export const recordDetailAccountFields: RecordDetailFields = {
  OwnerId: {
    label: "Account Owner",
    type: "lookup",
    href: (record) => `#user-${record.id}`,
    editable: false,
  },
  Phone: { label: "Phone", type: "phone" },
  Name: { label: "Account Name", type: "text" },
  Website: { label: "Website", type: "url" },
  Type: { label: "Type", type: "text" },
  AnnualRevenue: { label: "Annual Revenue", type: "currency", scale: 0 },
  BillingAddress: { label: "Billing Address", type: "address" },
  ShippingAddress: { label: "Shipping Address", type: "address" },
  LastModifiedDate: {
    label: "Last Modified Date",
    type: "relative",
    editable: false,
  },
  CreatedDate: { label: "Created Date", type: "datetime", editable: false },
}

// Edge Communications: Billing Address with its geocode, a Shipping Address with no country.
export const recordDetailAccount: RecordDetailValues = {
  OwnerId: jordan,
  Phone: "(512) 757-6000",
  Name: "Edge Communications",
  Website: "www.edgecomm.example",
  Type: "Customer - Direct",
  AnnualRevenue: 139000000,
  BillingAddress: {
    street: "312 Constitution Place",
    city: "Austin",
    state: "TX",
    postalCode: "78767",
    country: "USA",
    latitude: 30.2672,
    longitude: -97.7431,
  },
  ShippingAddress: {
    street: "312 Constitution Place\nLoading Dock B",
    city: "Austin",
    state: "TX",
    postalCode: "78767",
    country: null,
  },
  LastModifiedDate: "2026-10-13T12:00:00Z",
  CreatedDate: "2026-02-03T16:20:00Z",
}
