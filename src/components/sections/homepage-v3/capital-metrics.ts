import type { StatsData } from "@/api/stats";

// TODO: Replace these temporary homepage figures when the stats API exposes
// total earned yield, protocol revenue, and issued HOLLAR.
const mockCapitalMetrics = {
  earned: 8_400_000,
  generated: 4_200_000,
  hollarIssued: 12_000_000,
} as const;

export function getCapitalMetrics(stats: StatsData) {
  return [
    {
      title: "Earned",
      value: mockCapitalMetrics.earned,
      prefix: "$",
    },
    {
      title: "Allocated",
      value: stats.tvl,
      prefix: "$",
    },
    {
      title: "Generated",
      value: mockCapitalMetrics.generated,
      prefix: "$",
    },
    {
      title: "HOLLAR Issued",
      value: mockCapitalMetrics.hollarIssued,
      prefix: "$",
    },
  ] as const;
}
