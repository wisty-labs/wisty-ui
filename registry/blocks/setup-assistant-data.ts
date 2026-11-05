import type { SetupAssistantStep } from "@/components/wisty/setup-assistant"

export const salesSetupSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Ellen Hart and Priya Raman can sign in to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "complete", label: "Complete" },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: { value: "known", completed: 1 },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        description:
          "Check Edge Communications and Burlington Textiles for duplicates.",
        action: {
          type: "button",
          value: "confirm-source",
          label: "Confirm Source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        description: "Match Account Name, Billing Address and Account Owner.",
        action: {
          type: "button",
          value: "confirm-mapping",
          label: "Confirm Mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        description: "Check the sample before the remaining accounts import.",
        action: {
          type: "button",
          value: "approve-sample",
          label: "Approve Sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: false,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "not-started", label: "Not started" },
    action: {
      type: "button",
      value: "review-assignment",
      label: "Mark Reviewed",
    },
  },
] satisfies SetupAssistantStep[]

export const salesSetupPartialMessage =
  "Some setup steps couldn't be read. Showing the steps that could."

export const salesSetupPartialSteps = [
  {
    kind: "task",
    id: "sales-team",
    title: "Add your sales team",
    description: "Give each sales rep access to the Sales app.",
    estimatedTime: "4 mins",
    progress: { value: "unknown", label: "Team access couldn't be checked." },
    action: {
      type: "link",
      value: "manage-users",
      label: "Manage Users",
      href: "/setup/users",
      variant: "outline-brand",
    },
  },
  {
    kind: "sequence",
    id: "account-data",
    title: "Prepare your account data",
    description:
      "Review the source and the mapping before you import accounts.",
    estimatedTime: "10 mins",
    progress: {
      value: "unknown",
      label: "Account preparation progress is unavailable.",
    },
    substeps: [
      {
        id: "source",
        label: "Review source accounts",
        action: {
          type: "link",
          value: "review-source",
          label: "Review Source",
          href: "/setup/import/source",
        },
      },
      {
        id: "mapping",
        label: "Confirm the field mapping",
        action: {
          type: "link",
          value: "review-mapping",
          label: "Review Mapping",
          href: "/setup/import/mapping",
        },
      },
      {
        id: "sample",
        label: "Approve a sample import",
        action: {
          type: "link",
          value: "review-sample",
          label: "Review Sample",
          href: "/setup/import/sample",
        },
      },
    ],
  },
  {
    kind: "setting",
    id: "opportunity-teams",
    title: "Turn on Opportunity Teams",
    description: "Let reps add the teammates who work each deal with them.",
    tracked: true,
    action: {
      type: "toggle",
      value: "opportunity-teams",
      label: "Turn on Opportunity Teams",
      checked: true,
    },
  },
  {
    kind: "task",
    id: "lead-assignment",
    title: "Review lead assignment",
    description: "Confirm that new web leads reach the right sales rep.",
    estimatedTime: "5 mins",
    progress: { value: "complete", label: "Complete" },
  },
] satisfies SetupAssistantStep[]

export const serviceSetupSteps = [
  {
    kind: "task",
    id: "email-to-case",
    title: "Set up Email-to-Case",
    description: "Turn customer emails to your support address into cases.",
    estimatedTime: "15 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "email-to-case",
      label: "Open Email-to-Case",
      href: "/setup/email-to-case",
      variant: "outline-brand",
    },
  },
  {
    kind: "task",
    id: "knowledge",
    title: "Learn how agents use Knowledge",
    description: "See how articles help agents answer common questions.",
    estimatedTime: "20 mins",
    progress: { value: "untracked" },
    action: {
      type: "link",
      value: "knowledge-guide",
      label: "Read the Guide",
      href: "/help/knowledge",
    },
  },
  {
    kind: "setting",
    id: "case-feed",
    title: "Turn on Feed Tracking for cases",
    description: "Show changes to a case's status and owner in its feed.",
    tracked: false,
    action: {
      type: "toggle",
      value: "case-feed-tracking",
      label: "Turn on Feed Tracking for cases",
      checked: true,
    },
  },
] satisfies SetupAssistantStep[]
