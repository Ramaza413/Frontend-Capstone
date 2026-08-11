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
  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  // Show every Nth x-axis label so it doesn't get crowded on 30-day views.
  const labelEvery = Math.ceil(points.length / 6);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-end gap-1 h-40">
        {points.map((p, i) => {
          const heightPct = ((p.value - min) / range) * 100;
          return (
            <div
              key={i}
              title={`${p.date}: ${formatValue(p.value)}`}
              className="flex-1 rounded-t-sm transition-opacity hover:opacity-70"
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
