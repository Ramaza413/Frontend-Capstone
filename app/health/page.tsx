import { CheckCircle2, XCircle, Clock } from "lucide-react";

type CheckResult = {
  name: string;
  ok: boolean;
  latencyMs: number | null;
  detail: string;
};

async function checkService(
  name: string,
  url: string
): Promise<CheckResult> {
  const started = Date.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    const latencyMs = Date.now() - started;
    return {
      name,
      ok: res.ok,
      latencyMs,
      detail: res.ok ? "Responding normally" : `HTTP ${res.status}`,
    };
  } catch {
    return {
      name,
      ok: false,
      latencyMs: null,
      detail: "Unreachable",
    };
  }
}

export default async function HealthPage() {
  // Replace with your real endpoints (API, database ping route, etc.)
  const checks = await Promise.all([
    checkService("API", "https://jsonplaceholder.typicode.com/todos/1"),
  ]);

  const allOk = checks.every((c) => c.ok);
  const checkedAt = new Date().toLocaleString();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          System Health
        </h1>
        <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" aria-hidden />
          Last checked {checkedAt}
        </p>

        {/* Overall status banner */}
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 mb-6 text-sm font-medium ${
            allOk
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {allOk ? (
            <CheckCircle2 className="w-4 h-4" aria-hidden />
          ) : (
            <XCircle className="w-4 h-4" aria-hidden />
          )}
          {allOk ? "All systems operational" : "Some systems are degraded"}
        </div>

        {/* Individual checks */}
        <div className="space-y-3">
          {checks.map((check) => (
            <div
              key={check.name}
              className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {check.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" aria-hidden />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {check.name}
                  </p>
                  <p className="text-xs text-slate-500">{check.detail}</p>
                </div>
              </div>
              {check.latencyMs !== null && (
                <span className="text-xs text-slate-400">
                  {check.latencyMs}ms
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}