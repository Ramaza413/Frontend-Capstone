
export type MetricOutput = {
  metric: string;
  points: { date: string; value: number }[];
  average: number;
  trend: "up" | "down";
};

export function MetricResultCard({ data }: { data: MetricOutput }) {
  const max = Math.max(...data.points.map((p) => p.value));
  const min = Math.min(...data.points.map((p) => p.value));

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-3 my-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          {data.metric}
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
      <div className="flex items-end gap-[2px] h-12 mb-2">
        {data.points.map((p, i) => {
          const heightPct = ((p.value - min) / (max - min || 1)) * 100;
          return (
            <div
              key={i}
              title={`${p.date}: ${p.value}`}
              className="flex-1 bg-indigo-400 rounded-sm"
              style={{ height: `${Math.max(heightPct, 4)}%` }}
            />
          );
        })}
      </div>

      <p className="text-xs text-slate-500">
        Avg over {data.points.length} days:{" "}
        <span className="font-medium text-slate-700">{data.average}</span>
      </p>
    </div>
  );
}