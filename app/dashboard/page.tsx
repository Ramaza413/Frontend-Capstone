"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { MetricChart } from "../components/MetricChart";
import { KpiCard } from "../components/KpiCard";
import AnalyticsChat from "../components/AnalyticsChat";
import {
  getRevenueSeries,
  getUsersSeries,
  getSalesSeries,
  getSessionsSeries,
  summarize,
} from "@/lib/ai/mockData";

const money = (v: number) =>
  `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const num = (v: number) => v.toLocaleString();

const QUICK_LINKS = [
  { href: "/revenue", label: "Revenue" },
  { href: "/users", label: "Users" },
  { href: "/sales", label: "Sales" },
  { href: "/sessions", label: "Sessions" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

const PERIOD_OPTIONS = [7, 14, 30] as const;
type Period = (typeof PERIOD_OPTIONS)[number];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Period lives in the URL (?period=14) so the view is shareable
  // and survives a refresh, instead of resetting to the default every time.
  const periodParam = Number(searchParams.get("period"));

  const period: Period = PERIOD_OPTIONS.includes(periodParam as Period)
    ? (periodParam as Period)
    : 14;

  const setPeriod = (p: Period) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", String(p));

    router.replace(`/dashboard?${params.toString()}`, {
      scroll: false,
    });
  };

  // Real "last updated" timestamp, set on mount / whenever data is
  // recomputed — avoids a hardcoded "just now" that never changes.
  // Set after mount to avoid a server/client render mismatch.
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
  }, [period]);

  const revenue = useMemo(() => getRevenueSeries(period), [period]);
  const users = useMemo(() => getUsersSeries(period), [period]);
  const sales = useMemo(() => getSalesSeries(period), [period]);
  const sessions = useMemo(() => getSessionsSeries(period), [period]);

  const revStats = useMemo(() => summarize(revenue), [revenue]);
  const userStats = useMemo(() => summarize(users), [users]);
  const salesStats = useMemo(() => summarize(sales), [sales]);
  const sessionStats = useMemo(() => summarize(sessions), [sessions]);

  // Safe fallback in case a series ever comes back empty
  // (e.g. real API, no data yet)
  const latestUsers = users.at(-1)?.value ?? 0;
  const latestSessions = sessions.at(-1)?.value ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Dashboard
          </h1>

          <p className="text-xs text-slate-400 mt-1" aria-live="polite">
            {lastUpdated ? `Updated at ${lastUpdated}` : "Loading…"}
          </p>
        </div>

        {/* Period selector */}
        <div
          role="group"
          aria-label="Select time period"
          className="inline-flex rounded-lg border border-slate-200 bg-white p-1 self-start sm:self-auto"
        >
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                period === p
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link
          href="/revenue"
          aria-label="View revenue details"
          className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <KpiCard
            label={`Revenue (${period}d)`}
            value={money(revStats.total)}
            changePct={revStats.changePct}
          />
        </Link>

        <Link
          href="/users"
          aria-label="View user details"
          className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <KpiCard
            label="Users"
            value={num(latestUsers)}
            changePct={userStats.changePct}
          />
        </Link>

        <Link
          href="/sales"
          aria-label="View sales details"
          className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <KpiCard
            label={`Sales (${period}d)`}
            value={num(salesStats.total)}
            changePct={salesStats.changePct}
          />
        </Link>

        <Link
          href="/sessions"
          aria-label="View session details"
          className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <KpiCard
            label="Sessions now"
            value={num(latestSessions)}
            changePct={sessionStats.changePct}
          />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {l.label} →
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section aria-label="Revenue trend chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Revenue trend
          </h2>

          <MetricChart
            points={revenue}
            color="#4f46e5"
            formatValue={money}
          />
        </section>

        <section aria-label="User growth chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            User growth
          </h2>

          <MetricChart
            points={users}
            color="#0ea5e9"
            formatValue={num}
          />
        </section>

        <section aria-label="Sales volume chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Sales volume
          </h2>

          <MetricChart
            points={sales}
            color="#f59e0b"
            formatValue={num}
          />
        </section>

        <section aria-label="Active sessions chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Active sessions
          </h2>

          <MetricChart
            points={sessions}
            color="#10b981"
            formatValue={num}
          />
        </section>
      </div>

      <div className="w-full max-w-xl">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">
          Ask your data
        </h2>

        <AnalyticsChat />
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}