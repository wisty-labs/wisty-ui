import type { ListViewHeaderProps } from "@/components/wisty/list-view-header"

/** One row of the All Opportunities list. */
export interface ListViewOpportunity {
  name: string
  accountName: string
}

/** The rows the hero searches and counts, sorted by name. */
export const listViewOpportunities: ListViewOpportunity[] = [
  {
    name: "Burlington Textiles Weaving Plant Generator",
    accountName: "Burlington Textiles Corp of America",
  },
  {
    name: "Dickenson Mobile Generators",
    accountName: "Dickenson plc",
  },
  {
    name: "Edge Emergency Generator",
    accountName: "Edge Communications",
  },
  {
    name: "Edge Installation",
    accountName: "Edge Communications",
  },
  {
    name: "Express Logistics Standby Generator",
    accountName: "Express Logistics and Transport",
  },
  {
    name: "GenePoint Lab Generators",
    accountName: "GenePoint",
  },
  {
    name: "Grand Hotels Emergency Generators",
    accountName: "Grand Hotels & Resorts Ltd",
  },
  {
    name: "Pyramid Emergency Generators",
    accountName: "Pyramid Construction Inc.",
  },
  {
    name: "United Oil Refinery Generators",
    accountName: "United Oil & Gas Corp.",
  },
  {
    name: "University of AZ Installations",
    accountName: "University of Arizona",
  },
]

/** The All Opportunities header: the org's list views, two recent, one pinned, the actions and the meta line. */
export const listViewHeaderFixture: ListViewHeaderProps = {
  icon: "standard:opportunity",
  objectLabel: "Opportunities",
  views: [
    { value: "AllOpportunities", label: "All Opportunities" },
    { value: "ClosingThisMonth", label: "Closing This Month" },
    { value: "MyOpportunities", label: "My Opportunities" },
    { value: "Recent", label: "Recently Viewed" },
    { value: "Won", label: "Won" },
  ],
  recentViews: ["AllOpportunities", "Recent"],
  defaultView: "AllOpportunities",
  pinnedView: "AllOpportunities",
  itemCount: listViewOpportunities.length,
  sortedBy: "Opportunity Name",
  filteredBy: "All opportunities",
  updated: "a few seconds ago",
  actions: [
    { value: "new", label: "New" },
    { value: "import", label: "Import" },
    { value: "printable-view", label: "Printable View" },
  ],
  locale: "en-US",
}

/** A large list before its count is known, 50 rows in. */
export const listViewHeaderPartialFixture: ListViewHeaderProps = {
  ...listViewHeaderFixture,
  itemCount: 50,
  hasMoreItems: true,
}
