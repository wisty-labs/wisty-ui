import type { LookupRecord } from "@/components/wisty/lookup"
import type {
  RecordFormDefaultValues,
  RecordFormErrors,
  RecordFormFields,
} from "@/components/wisty/record-form"

export const recordFormAccounts: LookupRecord[] = [
  {
    id: "001A",
    name: "Burlington Textiles Corp of America",
    meta: "Account • Burlington, NC",
  },
  { id: "001B", name: "Dickenson plc", meta: "Account • Lawrence, KS" },
  { id: "001C", name: "Edge Communications", meta: "Account • Austin, TX" },
  {
    id: "001D",
    name: "Express Logistics and Transport",
    meta: "Account • Portland, OR",
  },
  { id: "001E", name: "GenePoint", meta: "Account • Mountain View, CA" },
]

// Contact's fields on its standard layout, by API name.
export const recordFormContactFields: RecordFormFields = {
  FirstName: { label: "First Name", type: "text", maxLength: 40 },
  LastName: { label: "Last Name", type: "text", required: true, maxLength: 80 },
  AccountId: {
    label: "Account Name",
    type: "lookup",
    records: recordFormAccounts,
    icon: "standard:account",
    placeholder: "Search Accounts...",
  },
  Title: { label: "Title", type: "text", maxLength: 128 },
  Email: { label: "Email", type: "email" },
  Phone: { label: "Phone", type: "phone" },
  LeadSource: {
    label: "Lead Source",
    type: "picklist",
    helpText: "Where the contact first heard of us, for campaign reports.",
    options: [
      { value: "Web", label: "Web" },
      { value: "Phone Inquiry", label: "Phone Inquiry" },
      { value: "Partner Referral", label: "Partner Referral" },
      { value: "Purchased List", label: "Purchased List" },
      { value: "Other", label: "Other" },
    ],
  },
  DoNotCall: { label: "Do Not Call", type: "boolean" },
  PreferredCallTime__c: { label: "Preferred Call Time", type: "time" },
}

// Event's fields on its standard layout; Start and End are instants, shown on the page's clock.
export const recordFormEventFields: RecordFormFields = {
  Subject: { label: "Subject", type: "text", required: true, maxLength: 255 },
  Location: { label: "Location", type: "text", maxLength: 255 },
  StartDateTime: { label: "Start", type: "datetime", required: true },
  EndDateTime: { label: "End", type: "datetime", required: true },
  Description: { label: "Description", type: "textarea", maxLength: 32000 },
}

// A site survey at Edge Communications in Austin: 9:00 to 10:00 AM in America/Chicago.
export const recordFormEvent: RecordFormDefaultValues = {
  Subject: "Site survey",
  Location: "Edge Communications, Austin data center",
  StartDateTime: "2026-06-18T14:00:00.000Z",
  EndDateTime: "2026-06-18T15:00:00.000Z",
  Description: null,
}

// Opportunity's fields on its standard layout; Probability is a fraction, 0.6 for 60%.
export const recordFormOpportunityFields: RecordFormFields = {
  Name: {
    label: "Opportunity Name",
    type: "text",
    required: true,
    maxLength: 120,
  },
  AccountId: {
    label: "Account Name",
    type: "lookup",
    records: recordFormAccounts,
    icon: "standard:account",
    placeholder: "Search Accounts...",
  },
  CloseDate: { label: "Close Date", type: "date", required: true },
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
  Amount: { label: "Amount", type: "currency", scale: 2 },
  Probability: { label: "Probability (%)", type: "percent", scale: 0 },
  NextStep: { label: "Next Step", type: "text", maxLength: 255 },
  Description: { label: "Description", type: "textarea", maxLength: 32000 },
}

// Edge Communications' generator deal, as the sample org has it.
export const recordFormOpportunity: RecordFormDefaultValues = {
  Name: "Edge Emergency Generator",
  AccountId: recordFormAccounts[2],
  CloseDate: "2026-11-20",
  StageName: "Proposal/Price Quote",
  Amount: 75000,
  Probability: 0.6,
  NextStep: "Send the revised quote",
  Description:
    "Backup generators for Edge's Austin data center, installed before the winter storm season.",
}

// The same deal after a save that a validation rule on Amount stopped.
export const recordFormOpportunityFailed: RecordFormDefaultValues = {
  ...recordFormOpportunity,
  Name: null,
  Amount: 320000,
}

export const recordFormOpportunityErrors: RecordFormErrors = {
  form: "Amount can't be more than the account's credit limit of $250,000.",
  fields: { Name: "Complete this field." },
}

// Contact's fields with compound Name and Mailing Address, each part labeled as its own field.
export const recordFormContactNameFields: RecordFormFields = {
  Name: { label: "Name", type: "name", required: true },
  AccountId: {
    label: "Account Name",
    type: "lookup",
    records: recordFormAccounts,
    icon: "standard:account",
    placeholder: "Search Accounts...",
  },
  Title: { label: "Title", type: "text", maxLength: 128 },
  Email: { label: "Email", type: "email" },
  MailingAddress: {
    label: "Mailing Address",
    type: "address",
    labels: {
      street: "Mailing Street",
      city: "Mailing City",
      state: "Mailing State/Province",
      postalCode: "Mailing Zip/Postal Code",
      country: "Mailing Country",
    },
  },
}

// Rose Gonzalez at Edge Communications, with each compound value as its parts.
export const recordFormContact: RecordFormDefaultValues = {
  Name: { salutation: "Ms.", firstName: "Rose", lastName: "Gonzalez" },
  AccountId: recordFormAccounts[2],
  Title: "SVP, Procurement",
  Email: "rose@edge.example",
  MailingAddress: {
    street: "312 Constitution Place",
    city: "Austin",
    state: "TX",
    postalCode: "78767",
    country: "USA",
  },
}
