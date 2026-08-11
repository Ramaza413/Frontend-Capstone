export function KpiCard({
  label,
  value,
  changePct,
}: {
  label: string;
  value: string;
  changePct?: number;
}) {
  const hasChange = typeof changePct === "number" && !Number.isNaN(changePct);
  const positive = hasChange && changePct >= 0;

  const changeText = hasChange
    ? `${positive ? "+" : ""}${changePct}%`
    : "—";

  const ariaLabel = hasChange
    ? `${label}: ${value}, ${positive ? "up" : "down"} ${Math.abs(changePct!)}% vs previous period`
    : `${label}: ${value}`;

  return (
    <div
      aria-label={ariaLabel}
      className="bg-white rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-900"
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className={`text-xs ${hasChange ? (positive ? "text-emerald-600" : "text-red-500") : "text-slate-400"}`}>
        {changeText}
        {hasChange && <span className="text-slate-400"> vs prev period</span>}
      </p>
    </div>
  );
}