
import { z } from "zod";
import { tool } from "ai";

import {
  getRevenueSeries,
  getUsersSeries,
  getChurnRateSeries,
  summarize,
  type SeriesPoint,
} from "./mockData";

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
      .describe(
        "How many recent days of history to return. Requests above 25 days will return an error."
      ),
  }),

  execute: async ({ metric, days }) => {
    // Demonstrate the tool's error state when
    // requesting more history than is currently supported.
    if (days > 25) {
      throw new Error(
        `Only 25 days of reliable history exist for "${metric}". Try a smaller range.`
      );
    }

    let points: SeriesPoint[];

    switch (metric) {
      case "mrr":
        points = getRevenueSeries(days);
        break;

      case "activeUsers":
        points = getUsersSeries(days);
        break;

      case "churnRate":
        points = getChurnRateSeries(days);
        break;

      default:
        throw new Error(`Unsupported metric: ${metric}`);
    }

    const summary = summarize(points);

    return {
      metric,
      points,
      average: summary.average,
      trend: summary.trend,
    };
  },
});

