import AnalyticsChat from "./components/AnalyticsChat";

const metrics = [
  { label: "MRR", value: "$18,240", change: "+4.2%" },
  { label: "Active Users", value: "3,102", change: "+1.8%" },
  { label: "Churn Rate", value: "2.1%", change: "-0.3%" },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        Analytics Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{m.label}</p>
            <p className="text-xl font-semibold text-slate-900">{m.value}</p>
            <p className="text-xs text-emerald-600">{m.change}</p>
          </div>
        ))}
      </div>

      <div className="max-w-xl">
        <AnalyticsChat />
      </div>
    </main>
  );
}