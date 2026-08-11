export function KpiCard({
  label,
  value,
  changePct,
}: {
  label: string;
  value: string;
  changePct: number;
}) {
  const positive = changePct >= 0;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className={`text-xs ${positive ? "text-emerald-600" : "text-red-500"}`}>
        {positive ? "+" : ""}
        {changePct}%
      </p>
    </div>
  );
}
