export type MetricOutput = {
  metric: string;
  points: { date: string; value: number }[];
  average: number;
  trend: "up" | "down";
};

// Turns "churnRate" into "Churn Rate", "mrr" into "Mrr" — so the
// uppercase tracking-wide style doesn't squash camelCase into one blob.
function humanizeMetric(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function formatValue(v: number): string {
  return Number.isInteger(v)
    ? v.toLocaleString()
    : v.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function MetricResultCard({ data }: { data: MetricOutput }) {
  if (!data.points || data.points.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white p-3 my-1">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          {humanizeMetric(data.metric)}
        </span>
        <p className="text-xs text-slate-400 mt-2">No data available for this metric.</p>
      </div>
    );
  }

  const values = data.points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const latest = data.points[data.points.length - 1];
  const sparklineSummary = `${humanizeMetric(data.metric)} sparkline: ${data.points.length} points, ranging from ${formatValue(min)} to ${formatValue(max)}, latest ${formatValue(latest.value)} on ${latest.date}.`;

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-3 my-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          {humanizeMetric(data.metric)}
        </span>
        <span
          className={`text-xs font-medium ${
            data.trend === "up" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {data.trend === "up" ? "↑ trending up" : "↓ trending down"}
        </span>
      </div>

      {/* tiny hand-rolled sparkline, no chart lib needed */}
      <div
        role="img"
        aria-label={sparklineSummary}
        className="flex items-end gap-[2px] h-12 mb-2"
      >
        {data.points.map((p, i) => {
          const heightPct = ((p.value - min) / (max - min || 1)) * 100;
          return (
            <div
              key={i}
              title={`${p.date}: ${formatValue(p.value)}`}
              className="flex-1 bg-indigo-400 rounded-sm"
              style={{ height: `${Math.max(heightPct, 4)}%` }}
            />
          );
        })}
      </div>

      <p className="text-xs text-slate-500">
        Avg over {data.points.length} days:{" "}
        <span className="font-medium text-slate-700">{formatValue(data.average)}</span>
      </p>
    </div>
  );
}