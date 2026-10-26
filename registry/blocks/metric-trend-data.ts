import type {
  MetricTrendMetric,
  MetricTrendTabsProps,
} from "@/components/wisty/metric-trend"

const weeks = [
  ["Week of Jul 7", "Week of Apr 7"],
  ["Week of Jul 14", "Week of Apr 14"],
  ["Week of Jul 21", "Week of Apr 21"],
  ["Week of Jul 28", "Week of Apr 28"],
  ["Week of Aug 4", "Week of May 5"],
  ["Week of Aug 11", "Week of May 12"],
  ["Week of Aug 18", "Week of May 19"],
  ["Week of Aug 25", "Week of May 26"],
  ["Week of Sep 1", "Week of Jun 2"],
  ["Week of Sep 8", "Week of Jun 9"],
  ["Week of Sep 15", "Week of Jun 16"],
  ["Week of Sep 22", "Week of Jun 23"],
  ["Week of Sep 29", "Week of Jun 30"],
] as const

const weekly = (
  values: (number | null)[],
  previous: number[]
): MetricTrendMetric["points"] =>
  weeks.map(([label, previousLabel], index) => ({
    label,
    value: values[index] ?? null,
    previous: previous[index],
    previousLabel,
  }))

/** Q3 FY2027 week by week, each against the same week of Q2. */
export const salesTrendPoints = {
  pipeline: weekly(
    [
      9_800_000, 10_100_000, 10_400_000, 10_200_000, 10_900_000, 11_300_000,
      11_100_000, 11_600_000, 11_900_000, 12_200_000, 12_000_000, 12_300_000,
      12_480_000,
    ],
    [
      9_400_000, 9_600_000, 9_500_000, 9_900_000, 10_200_000, 10_000_000,
      10_400_000, 10_600_000, 10_500_000, 10_800_000, 11_000_000, 10_900_000,
      11_020_000,
    ]
  ),
  closedWon: weekly(
    [
      120_000, 300_000, 510_000, 660_000, 960_000, 1_180_000, 1_440_000,
      1_750_000, 2_030_000, 2_380_000, 2_710_000, 3_090_000, 3_410_000,
    ],
    [
      150_000, 350_000, 590_000, 810_000, 1_080_000, 1_380_000, 1_630_000,
      1_920_000, 2_230_000, 2_590_000, 2_890_000, 3_220_000, 3_560_000,
    ]
  ),
  winRate: weekly(
    [
      0.29, 0.296, 0.301, 0.298, 0.305, 0.31, 0.307, 0.312, 0.315, 0.314, 0.317,
      0.316, 0.318,
    ],
    [
      0.281, 0.284, 0.279, 0.286, 0.288, 0.283, 0.29, 0.287, 0.289, 0.285,
      0.288, 0.286, 0.287,
    ]
  ),
  dealSize: weekly(
    [
      61_200, 62_500, 60_800, 63_400, 64_100, 63_000, 65_200, 64_800, 66_000,
      65_100, 66_400, 67_200, 66_900,
    ],
    [
      58_400, 59_100, 60_200, 59_500, 60_900, 61_300, 60_400, 61_800, 62_000,
      61_500, 62_600, 62_100, 62_800,
    ]
  ),
}

/** A sales leader's Q3 FY2027, week by week against Q2. */
export const metricTrendFixture: Omit<
  MetricTrendTabsProps,
  "aria-label" | "aria-labelledby"
> = {
  period: "This quarter",
  comparison: "Last quarter",
  currency: "USD",
  locale: "en-US",
  metrics: [
    {
      id: "pipeline",
      label: "Open pipeline",
      value: 12_480_000,
      previous: 11_020_000,
      points: salesTrendPoints.pipeline,
    },
    {
      id: "closed-won",
      label: "Closed won",
      value: 3_410_000,
      previous: 3_560_000,
      points: salesTrendPoints.closedWon,
    },
    {
      id: "win-rate",
      label: "Win rate",
      value: 0.318,
      previous: 0.287,
      format: { style: "percent", maximumFractionDigits: 1 },
      color: 3,
      points: salesTrendPoints.winRate,
    },
    {
      id: "deal-size",
      label: "Average deal size",
      value: 66_900,
      previous: 62_800,
      color: 5,
      points: salesTrendPoints.dealSize,
    },
  ],
}

const days = [
  ["Sep 16", "Sep 2"],
  ["Sep 17", "Sep 3"],
  ["Sep 18", "Sep 4"],
  ["Sep 19", "Sep 5"],
  ["Sep 20", "Sep 6"],
  ["Sep 21", "Sep 7"],
  ["Sep 22", "Sep 8"],
  ["Sep 23", "Sep 9"],
  ["Sep 24", "Sep 10"],
  ["Sep 25", "Sep 11"],
  ["Sep 26", "Sep 12"],
  ["Sep 27", "Sep 13"],
  ["Sep 28", "Sep 14"],
  ["Sep 29", "Sep 15"],
] as const

const daily = (
  values: (number | null)[],
  previous: number[]
): MetricTrendMetric["points"] =>
  days.map(([label, previousLabel], index) => ({
    label,
    value: values[index] ?? null,
    previous: previous[index],
    previousLabel,
  }))

const dailyOnly = (values: (number | null)[]): MetricTrendMetric["points"] =>
  days.map(([label], index) => ({ label, value: values[index] ?? null }))

/** A service supervisor's two weeks, ten days in; the days to come are null. */
export const metricTrendServiceFixture: Omit<
  MetricTrendTabsProps,
  "aria-label" | "aria-labelledby"
> = {
  period: "These two weeks",
  comparison: "Two weeks before",
  locale: "en-US",
  metrics: [
    {
      id: "backlog",
      label: "Open cases",
      value: 1_275,
      previous: 1_394,
      isIncreasePositive: false,
      points: daily(
        [
          1_402,
          1_377,
          1_351,
          1_330,
          1_318,
          1_296,
          1_284,
          1_301,
          1_290,
          1_275,
          null,
          null,
          null,
          null,
        ],
        [
          1_310, 1_342, 1_365, 1_371, 1_380, 1_388, 1_392, 1_385, 1_379, 1_394,
          1_401, 1_398, 1_405, 1_392,
        ]
      ),
    },
    {
      id: "first-response",
      label: "First response",
      value: 27,
      previous: 42,
      format: { style: "unit", unit: "minute", unitDisplay: "short" },
      isIncreasePositive: false,
      color: 3,
      points: daily(
        [38, 36, 41, 35, 33, 31, 29, 30, 28, 27, null, null, null, null],
        [42, 44, 40, 43, 41, 45, 39, 41, 40, 42, 38, 41, 40, 39]
      ),
    },
    {
      id: "csat",
      label: "CSAT",
      value: 4.6,
      format: { maximumFractionDigits: 1 },
      color: 5,
      points: dailyOnly([
        4.4,
        4.5,
        4.5,
        4.4,
        4.6,
        4.7,
        4.6,
        4.6,
        4.7,
        4.6,
        null,
        null,
        null,
        null,
      ]),
    },
  ],
}
