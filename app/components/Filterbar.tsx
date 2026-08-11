"use client";

const PERIODS = [7, 14, 30] as const;
export type Period = (typeof PERIODS)[number];

export function FilterBar({
  period,
  onChange,
}: {
  period: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 mr-1">Filter:</span>
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            period === p
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Last {p}d
        </button>
      ))}
    </div>
  );
}
