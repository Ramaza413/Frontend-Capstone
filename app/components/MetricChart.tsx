import type { SeriesPoint } from "@/lib/ai/mockData";

export function MetricChart({
  points,
  color = "#4f46e5",
  formatValue = (v: number) => String(v),
}: {
  points: SeriesPoint[];
  color?: string;
  formatValue?: (v: number) => string;
}) {
  if (!points || points.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            ∿
          </div>

          <p className="text-xs font-medium text-slate-500">
            No data available
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Try selecting a different period
          </p>
        </div>
      </div>
    );
  }

  const values = points.map((point) => point.value);

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const latest = points[points.length - 1];
  const first = points[0];

  const change =
    first.value === 0
      ? 0
      : ((latest.value - first.value) / Math.abs(first.value)) * 100;

  const trend =
    change > 0 ? "up" : change < 0 ? "down" : "neutral";

  const labelEvery = Math.max(1, Math.ceil(points.length / 6));

  const summary =
    `Chart showing ${points.length} data points, ` +
    `ranging from ${formatValue(min)} to ${formatValue(max)}. ` +
    `Latest value: ${formatValue(latest.value)} on ${latest.date}.`;

  const formatDate = (date: string) => {
    const parsed = new Date(date);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }

    return date.replace("Day ", "D");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Performance
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              {formatValue(latest.value)}
            </span>

            <span
              className={`text-[11px] font-semibold ${
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-rose-600"
                    : "text-slate-400"
              }`}
            >
              {trend === "up"
                ? `↑ ${Math.abs(change).toFixed(1)}%`
                : trend === "down"
                  ? `↓ ${Math.abs(change).toFixed(1)}%`
                  : "— 0.0%"}
            </span>
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Latest value
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Period
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {points.length} days
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {formatDate(first.date)} — {formatDate(latest.date)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-5">
        <div className="relative">
          {/* Horizontal guide lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 flex h-40 flex-col justify-between"
          >
            <div className="border-t border-dashed border-slate-100" />
            <div className="border-t border-dashed border-slate-100" />
            <div className="border-t border-dashed border-slate-100" />
            <div className="border-t border-dashed border-slate-100" />
          </div>

          <div
            role="img"
            aria-label={summary}
            className="relative flex h-40 items-end gap-1"
          >
            {points.map((point, index) => {
              const heightPct =
                ((point.value - min) / range) * 100;

              const isLatest = index === points.length - 1;

              return (
                <div
                  key={`${point.date}-${index}`}
                  tabIndex={0}
                  title={`${point.date}: ${formatValue(point.value)}`}
                  aria-label={`${point.date}: ${formatValue(point.value)}`}
                  className="group relative flex h-full flex-1 items-end rounded-t-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-900"
                >
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
                    <div className="whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg">
                      <div>{formatValue(point.value)}</div>
                      <div className="mt-0.5 text-slate-300">
                        {formatDate(point.date)}
                      </div>
                    </div>
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-200 ${
                      isLatest
                        ? "opacity-100"
                        : "opacity-75 group-hover:opacity-100"
                    }`}
                    style={{
                      height: `${Math.max(heightPct, 4)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis */}
        <div className="mt-2 grid h-4 grid-flow-col auto-cols-fr text-[9px] text-slate-400">
          {points.map((point, index) => {
            const shouldShow =
              index % labelEvery === 0 ||
              index === points.length - 1;

            return (
              <span
                key={`${point.date}-label-${index}`}
                className={
                  shouldShow
                    ? "truncate text-center"
                    : "invisible"
                }
              >
                {formatDate(point.date)}
              </span>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 border-t border-slate-100 bg-slate-50/50">
        <div className="border-r border-slate-100 px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Minimum
          </p>

          <p className="mt-1 text-xs font-bold text-slate-700">
            {formatValue(min)}
          </p>
        </div>

        <div className="border-r border-slate-100 px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Maximum
          </p>

          <p className="mt-1 text-xs font-bold text-slate-700">
            {formatValue(max)}
          </p>
        </div>

        <div className="px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Latest
          </p>

          <p className="mt-1 text-xs font-bold text-slate-700">
            {formatValue(latest.value)}
          </p>
        </div>
      </div>
    </div>
  );
}