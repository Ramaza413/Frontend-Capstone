export type MetricOutput = {
  metric: string;
  points: { date: string; value: number }[];
  average: number;
  trend: "up" | "down";
};

function humanizeMetric(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function formatValue(v: number): string {
  return Number.isInteger(v)
    ? v.toLocaleString()
    : v.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
}

function formatDate(date: string): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function MetricResultCard({
  data,
}: {
  data: MetricOutput;
}) {
  const metricName = humanizeMetric(data.metric);

  if (!data.points || data.points.length === 0) {
    return (
      <div className="my-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
            ◌
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700">
              {metricName}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              No data available for this metric.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const values = data.points.map((point) => point.value);

  const max = Math.max(...values);
  const min = Math.min(...values);

  const latest = data.points[data.points.length - 1];

  const first = data.points[0];

  const change =
    first.value === 0
      ? 0
      : ((latest.value - first.value) / Math.abs(first.value)) * 100;

  const formattedChange = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

  const sparklineSummary =
    `${metricName} trend with ${data.points.length} data points, ` +
    `ranging from ${formatValue(min)} to ${formatValue(max)}, ` +
    `latest value ${formatValue(latest.value)} on ${latest.date}.`;

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-600">
            ↗
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Metric
            </p>

            <h4 className="mt-0.5 text-sm font-bold text-slate-800">
              {metricName}
            </h4>
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            data.trend === "up"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {data.trend === "up" ? "↑ Trending up" : "↓ Trending down"}
        </span>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Latest
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            {formatValue(latest.value)}
          </p>

          <p
            className={`mt-1 text-[11px] font-semibold ${
              change > 0
                ? "text-emerald-600"
                : change < 0
                  ? "text-rose-600"
                  : "text-slate-400"
            }`}
          >
            {formattedChange} over period
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Average
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            {formatValue(data.average)}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {data.points.length} data points
          </p>
        </div>
      </div>

      {/* Sparkline */}
      <div className="px-4 pb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-400">
            Trend
          </span>

          <span className="text-[10px] text-slate-400">
            {formatDate(first.date)} — {formatDate(latest.date)}
          </span>
        </div>

        <div
          role="img"
          aria-label={sparklineSummary}
          className="flex h-16 items-end gap-1 rounded-lg bg-slate-50 px-2 py-2"
        >
          {data.points.map((point, index) => {
            const heightPct =
              ((point.value - min) / (max - min || 1)) * 100;

            return (
              <div
                key={`${point.date}-${index}`}
                title={`${point.date}: ${formatValue(point.value)}`}
                className={`flex-1 rounded-sm transition-all duration-200 hover:opacity-70 ${
                  data.trend === "up"
                    ? "bg-emerald-400"
                    : "bg-rose-400"
                }`}
                style={{
                  height: `${Math.max(heightPct, 6)}%`,
                  minWidth: "2px",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">
        <span className="text-[10px] text-slate-400">
          Latest reading
        </span>

        <span className="text-[10px] font-medium text-slate-600">
          {formatDate(latest.date)}
        </span>
      </div>
    </div>
  );
}