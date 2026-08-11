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
      <div className="bg-white rounded-xl border border-slate-200 p-4 h-40 flex items-center justify-center">
        <p className="text-xs text-slate-400">No data available for this period</p>
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  // Show every Nth x-axis label so it doesn't get crowded on 30-day views.
  const labelEvery = Math.max(1, Math.ceil(points.length / 6));

  const latest = points[points.length - 1];
  const summary = `Chart showing ${points.length} data points, ranging from ${formatValue(min)} to ${formatValue(max)}. Latest value: ${formatValue(latest.value)} on ${latest.date}.`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div
        role="img"
        aria-label={summary}
        className="flex items-end gap-1 h-40"
      >
        {points.map((p, i) => {
          const heightPct = ((p.value - min) / range) * 100;
          return (
            <div
              key={i}
              tabIndex={0}
              title={`${p.date}: ${formatValue(p.value)}`}
              aria-label={`${p.date}: ${formatValue(p.value)}`}
              className="flex-1 rounded-t-sm transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-900"
              style={{
                height: `${Math.max(heightPct, 3)}%`,
                backgroundColor: color,
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-slate-400">
        {points.map((p, i) =>
          i % labelEvery === 0 || i === points.length - 1 ? (
            <span key={i}>{p.date.replace("Day ", "D")}</span>
          ) : (
            <span key={i} />
          )
        )}
      </div>
      <div className="flex justify-between mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2">
        <span>
          Min: <span className="font-medium text-slate-700">{formatValue(min)}</span>
        </span>
        <span>
          Max: <span className="font-medium text-slate-700">{formatValue(max)}</span>
        </span>
      </div>
    </div>
  );
}