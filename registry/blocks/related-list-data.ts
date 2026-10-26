import type {
  RelatedListAction,
  RelatedListProps,
} from "@/components/wisty/related-list"

export interface Contact {
  id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  href: string
}

export interface Opportunity {
  id: string
  name: string
  stage: string
  /** In the list's currency. */
  amount: number | null
  /** A calendar date, YYYY-MM-DD. */
  closeDate: string
  href: string
}

/** New, as the page layout's related list shows it. */
export const newContact: RelatedListAction = {
  value: "new",
  label: "New",
  ariaLabel: "New Contact",
}

export const edgeContacts: Contact[] = [
  {
    id: "003Dn00000EdgeRG1",
    name: "Rose Gonzalez",
    title: "SVP, Procurement",
    email: "rose@edgecomm.example",
    phone: "(512) 757-6000",
    href: "/contacts/003Dn00000EdgeRG1",
  },
  {
    id: "003Dn00000EdgeSF1",
    name: "Sean Forbes",
    title: "CFO",
    email: "sean@edgecomm.example",
    phone: "(512) 757-6000",
    href: "/contacts/003Dn00000EdgeSF1",
  },
]

export const edgeOpportunities: Opportunity[] = [
  {
    id: "006Dn00000EdgeEG1",
    name: "Edge Emergency Generator",
    stage: "Id. Decision Makers",
    amount: 35_000,
    closeDate: "2026-11-20",
    href: "/opportunities/006Dn00000EdgeEG1",
  },
  {
    id: "006Dn00000EdgeIN1",
    name: "Edge Installation",
    stage: "Closed Won",
    amount: 50_000,
    closeDate: "2026-06-12",
    href: "/opportunities/006Dn00000EdgeIN1",
  },
  {
    id: "006Dn00000EdgeSL1",
    name: "Edge SLA",
    stage: "Closed Won",
    amount: 60_000,
    closeDate: "2026-07-03",
    href: "/opportunities/006Dn00000EdgeSL1",
  },
]

// The first six by name of a longer list, so the count shows as six with more.
export const unitedOilContacts: Contact[] = [
  ["003Dn00000UogAS1", "Arthur Song", "CEO", "asong@uog.example"],
  ["003Dn00000UogAG1", "Avi Green", "CFO", "agreen@uog.example"],
  ["003Dn00000UogJR1", "Jack Rogers", "VP, Facilities", "jrogers@uog.example"],
  ["003Dn00000UogLB1", "Lauren Boyle", "SVP, Technology", "lboyle@uog.example"],
  ["003Dn00000UogLD1", "Liz D'Cruz", "VP, Facilities", "ldcruz@uog.example"],
  [
    "003Dn00000UogSP1",
    "Stella Pavlova",
    "SVP, Production",
    "spavlova@uog.example",
  ],
].map(([id, name, title, email]) => ({
  id: id!,
  name: name!,
  title: title!,
  email: email!,
  phone: "(212) 842-5500",
  href: `/contacts/${id}`,
}))

/** Edge Communications' contacts: the block's props but its columns. */
export const relatedListFixture = {
  title: "Contacts",
  icon: "standard:contact",
  records: edgeContacts,
  count: 2,
  href: "/accounts/001Dn00000EdgeCOM/contacts",
  actions: [newContact],
  rowActions: [
    { value: "edit", label: "Edit" },
    { value: "delete", label: "Delete" },
  ],
  locale: "en-US",
} satisfies Omit<RelatedListProps<Contact>, "columns">
