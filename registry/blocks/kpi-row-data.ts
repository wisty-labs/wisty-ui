import type { KpiRowProps } from "@/components/wisty/kpi-row"

/** A sales team's Q3 FY2027 against Q2, as of Sep 29. */
export const kpiRowFixture: KpiRowProps = {
  comparison: "last quarter",
  currency: "USD",
  locale: "en-US",
  metrics: [
    {
      id: "pipeline",
      label: "Open pipeline",
      value: 12_480_000,
      previous: 11_020_000,
    },
    {
      id: "closed-won",
      label: "Closed won",
      value: 3_410_000,
      previous: 3_560_000,
    },
    {
      id: "win-rate",
      label: "Win rate",
      value: 0.318,
      previous: 0.287,
      format: { style: "percent", maximumFractionDigits: 1 },
    },
    {
      id: "deal-size",
      label: "Average deal size",
      value: 66_900,
      previous: 62_800,
    },
  ],
}

/** The same quarter with two figures the app can't give: no previous open pipeline, no quota attainment yet. */
export const kpiRowPartialFixture: KpiRowProps = {
  comparison: "last quarter",
  currency: "USD",
  locale: "en-US",
  metrics: [
    {
      id: "pipeline",
      label: "Open pipeline",
      value: 12_480_000,
    },
    {
      id: "closed-won",
      label: "Closed won",
      value: 3_410_000,
      previous: 3_560_000,
    },
    {
      id: "win-rate",
      label: "Win rate",
      value: 0.318,
      previous: 0.287,
      format: { style: "percent", maximumFractionDigits: 1 },
    },
    {
      id: "attainment",
      label: "Quota attainment",
      value: null,
      previous: 0.94,
      format: { style: "percent", maximumFractionDigits: 0 },
    },
  ],
}
