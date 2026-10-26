import type { ListViewHeaderView } from "@/components/wisty/list-view-header"

/** One account in the All Accounts list view, its columns as plain values. */
export interface ListViewAccount {
  /** The account's Id. */
  id: string
  /** The account's name, linked to its record page. */
  name: string
  /** The account's phone, or null. */
  phone: string | null
  /** The account's Type picklist value, as labeled. */
  type: string | null
  /** The account owner's name. */
  owner: string
  /** Last Modified Date, an ISO 8601 instant. */
  lastModified: string
  /** The account's record page. */
  href: string
}

/** The sample org's accounts, as the All Accounts list view shows them. */
export const listViewAccounts: ListViewAccount[] = [
  {
    id: "001Dn00000BurlTX",
    name: "Burlington Textiles Corp of America",
    phone: "(336) 222-7000",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-12T15:42:00Z",
    href: "/accounts/001Dn00000BurlTX",
  },
  {
    id: "001Dn00000DickPL",
    name: "Dickenson plc",
    phone: "(785) 241-6200",
    type: "Customer - Channel",
    owner: "Ellen Hart",
    lastModified: "2026-06-03T18:10:00Z",
    href: "/accounts/001Dn00000DickPL",
  },
  {
    id: "001Dn00000EdgeCOM",
    name: "Edge Communications",
    phone: "(512) 757-6000",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-12T14:05:00Z",
    href: "/accounts/001Dn00000EdgeCOM",
  },
  {
    id: "001Dn00000ExprLG",
    name: "Express Logistics and Transport",
    phone: "(503) 421-7800",
    type: "Customer - Channel",
    owner: "Priya Raman",
    lastModified: "2026-05-29T20:31:00Z",
    href: "/accounts/001Dn00000ExprLG",
  },
  {
    id: "001Dn00000GenePT",
    name: "GenePoint",
    phone: "(650) 867-3450",
    type: "Customer - Channel",
    owner: "Priya Raman",
    lastModified: "2026-06-10T16:48:00Z",
    href: "/accounts/001Dn00000GenePT",
  },
  {
    id: "001Dn00000GrndHR",
    name: "Grand Hotels & Resorts Ltd",
    phone: "(312) 596-1000",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-08T13:22:00Z",
    href: "/accounts/001Dn00000GrndHR",
  },
  {
    id: "001Dn00000PyrmCN",
    name: "Pyramid Construction Inc.",
    phone: "(014) 427-4427",
    type: "Customer - Channel",
    owner: "Priya Raman",
    lastModified: "2026-05-21T09:15:00Z",
    href: "/accounts/001Dn00000PyrmCN",
  },
  {
    id: "001Dn00000SfrcIN",
    name: "sForce",
    phone: "(415) 901-7000",
    type: null,
    owner: "Ellen Hart",
    lastModified: "2026-04-30T17:02:00Z",
    href: "/accounts/001Dn00000SfrcIN",
  },
  {
    id: "001Dn00000UogCRP",
    name: "United Oil & Gas Corp.",
    phone: "(212) 842-5500",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-11T19:40:00Z",
    href: "/accounts/001Dn00000UogCRP",
  },
  {
    id: "001Dn00000UogSGP",
    name: "United Oil & Gas, Singapore",
    phone: "(650) 450-8810",
    type: "Customer - Direct",
    owner: "Priya Raman",
    lastModified: "2026-06-02T03:55:00Z",
    href: "/accounts/001Dn00000UogSGP",
  },
  {
    id: "001Dn00000UogUKL",
    name: "United Oil & Gas, UK",
    phone: "+44 191 4956203",
    type: "Customer - Direct",
    owner: "Priya Raman",
    lastModified: "2026-05-26T11:08:00Z",
    href: "/accounts/001Dn00000UogUKL",
  },
  {
    id: "001Dn00000UnivAZ",
    name: "University of Arizona",
    phone: "(520) 773-9050",
    type: "Customer - Direct",
    owner: "Ellen Hart",
    lastModified: "2026-06-09T22:17:00Z",
    href: "/accounts/001Dn00000UnivAZ",
  },
]

/** The org's Accounts list views, in the switcher's order. */
export const listViewAccountViews: ListViewHeaderView[] = [
  { value: "AllAccounts", label: "All Accounts" },
  { value: "MyAccounts", label: "My Accounts" },
  { value: "NewThisWeek", label: "New This Week" },
  {
    value: "PlatinumandGoldSLACustomers",
    label: "Platinum and Gold SLA Customers",
  },
  { value: "RecentlyViewedAccounts", label: "Recently Viewed Accounts" },
]

/** The user's recently used Accounts list views, most recent first. */
export const listViewRecentAccountViews = ["AllAccounts", "MyAccounts"]
