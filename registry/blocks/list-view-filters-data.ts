import type {
  ListViewFilterSchema,
  ListViewFiltersValue,
} from "@/components/wisty/list-view-filtering"

/** An account row, as an All Accounts list view holds it. */
export interface ListViewFiltersAccountRow {
  /** The account's name. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, or null. */
  type: string | null
  /** The owner's user Id, or undefined when it wasn't read. */
  ownerId?: string | null
}

/** An opportunity row, as an All Opportunities list view holds it. */
export interface ListViewFiltersOpportunityRow {
  /** The opportunity's name. */
  name: string
  /** The Stage picklist value. */
  stage: string
  /** The amount in USD, or null. */
  amount: number | null
  /** The probability as a fraction, 0.6 for 60%. */
  probability: number | null
  /** The close date, as "YYYY-MM-DD". */
  closeDate: string
  /** Whether the opportunity is closed. */
  closed: boolean
  /** The owner's user Id. */
  ownerId: string
}

/** A case row, as a Cases list view holds it. */
export interface ListViewFiltersCaseRow {
  /** The case's subject. */
  subject: string
  /** The Status picklist value. */
  status: string
  /** The Priority picklist value. */
  priority: string
  /** The owner's user Id. */
  ownerId: string
}

const signedInUserId = "005Dn000003EllenH"

export const listViewFiltersAccountSchema: ListViewFilterSchema<ListViewFiltersAccountRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Account Name",
        type: "text",
        read: (account) => account.name,
      },
      {
        id: "Phone",
        label: "Phone",
        type: "text",
        nullable: true,
        read: (account) => account.phone,
      },
      {
        id: "Type",
        label: "Type",
        type: "picklist",
        nullable: true,
        options: [
          { value: "Customer - Direct", label: "Customer - Direct" },
          { value: "Customer - Channel", label: "Customer - Channel" },
          { value: "Prospect", label: "Prospect" },
          { value: "Partner", label: "Partner" },
        ],
        read: (account) => account.type,
      },
    ],
    owner: {
      allLabel: "All accounts",
      mineLabel: "My accounts",
      currentUserId: signedInUserId,
      read: (account) => account.ownerId,
    },
  }

export const listViewFiltersDirectCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
  ],
  logic: null,
}

export const listViewFiltersCustomers: ListViewFiltersValue = {
  owner: "all",
  filters: [
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Direct",
    },
    {
      field: "Type",
      type: "picklist",
      operator: "equals",
      value: "Customer - Channel",
    },
    {
      field: "Name",
      type: "text",
      operator: "not-contains",
      value: "Test",
    },
  ],
  logic: "(1 OR 2) AND 3",
}

export const listViewFiltersOpportunitySchema: ListViewFilterSchema<ListViewFiltersOpportunityRow> =
  {
    fields: [
      {
        id: "Name",
        label: "Opportunity Name",
        type: "text",
        read: (opportunity) => opportunity.name,
      },
      {
        id: "StageName",
        label: "Stage",
        type: "picklist",
        options: [
          { value: "Prospecting", label: "Prospecting" },
          { value: "Qualification", label: "Qualification" },
          { value: "Proposal/Price Quote", label: "Proposal/Price Quote" },
          { value: "Negotiation/Review", label: "Negotiation/Review" },
          { value: "Closed Won", label: "Closed Won" },
          { value: "Closed Lost", label: "Closed Lost" },
        ],
        read: (opportunity) => opportunity.stage,
      },
      {
        id: "Amount",
        label: "Amount",
        type: "currency",
        currencyCode: "USD",
        nullable: true,
        read: (opportunity) => opportunity.amount,
      },
      {
        id: "Probability",
        label: "Probability (%)",
        type: "percent",
        nullable: true,
        read: (opportunity) => opportunity.probability,
      },
      {
        id: "CloseDate",
        label: "Close Date",
        type: "date",
        today: "2026-06-18",
        read: (opportunity) => opportunity.closeDate,
      },
      {
        id: "IsClosed",
        label: "Closed",
        type: "boolean",
        read: (opportunity) => opportunity.closed,
      },
    ],
    owner: {
      allLabel: "All opportunities",
      mineLabel: "My opportunities",
      currentUserId: signedInUserId,
      read: (opportunity) => opportunity.ownerId,
    },
  }

export const listViewFiltersOpenPipeline: ListViewFiltersValue = {
  owner: "mine",
  filters: [
    {
      field: "IsClosed",
      type: "boolean",
      operator: "equals",
      value: false,
    },
    {
      field: "Amount",
      type: "currency",
      operator: "greater-than",
      value: 50000,
    },
    {
      field: "CloseDate",
      type: "date",
      operator: "less-or-equal",
      value: "2026-09-30",
    },
  ],
  logic: "1 AND (2 OR 3)",
}

export const listViewFiltersCaseSchema: ListViewFilterSchema<ListViewFiltersCaseRow> =
  {
    fields: [
      {
        id: "Subject",
        label: "Subject",
        type: "text",
        read: (supportCase) => supportCase.subject,
      },
      {
        id: "Status",
        label: "Status",
        type: "picklist",
        options: [
          { value: "New", label: "New" },
          { value: "Working", label: "Working" },
          { value: "Escalated", label: "Escalated" },
          { value: "Closed", label: "Closed" },
        ],
        read: (supportCase) => supportCase.status,
      },
      {
        id: "Priority",
        label: "Priority",
        type: "picklist",
        options: [
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ],
        read: (supportCase) => supportCase.priority,
      },
    ],
    owner: {
      allLabel: "All cases",
      mineLabel: "My cases",
      currentUserId: signedInUserId,
      read: (supportCase) => supportCase.ownerId,
    },
    lockedFilters: [
      {
        key: "open-cases",
        condition: {
          field: "Status",
          type: "picklist",
          operator: "not-equal",
          value: "Closed",
        },
        reason: "This view shows open cases only.",
      },
    ],
  }
