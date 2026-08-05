import { z } from "zod";
import { tool } from "ai";

// Mock metric history — replace with real DB query later.
// Each series has 30 days of daily values.
const metricsData: Record<string, { date: string; value: number }[]> = {
  mrr: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: 15000 + i * 110 + Math.round(Math.random() * 300),
  })),
  activeUsers: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: 2800 + i * 10 + Math.round(Math.random() * 50),
  })),
  churnRate: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: +(2.5 - i * 0.01 + Math.random() * 0.2).toFixed(2),
  })),
};

export const queryMetricTool = tool({
  description:
    "Query historical daily values for a SaaS metric (mrr, activeUsers, or churnRate) over a recent number of days.",
  inputSchema: z.object({
    metric: z
      .enum(["mrr", "activeUsers", "churnRate"])
      .describe("Which metric to fetch history for"),
    days: z
      .number()
      .min(1)
      .max(30)
      .default(7)
      .describe("How many recent days of history to return (1-30)"),
  }),
  execute: async ({ metric, days }) => {
    // Simulated failure case: deliberately demonstrate the error state
    // when asking for more history than we have reliable data for.
    if (days > 25) {
      throw new Error(
        `Only 25 days of reliable history exist for "${metric}". Try a smaller range.`
      );
    }

    const series = metricsData[metric];
    const points = series.slice(-days);
    const average =
      points.reduce((sum, p) => sum + p.value, 0) / points.length;
    const trend =
      points[points.length - 1].value >= points[0].value ? "up" : "down";

    return { metric, points, average: +average.toFixed(2), trend };
  },
});