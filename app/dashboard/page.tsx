"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
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

const money = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const num = (v: number) => v.toLocaleString();

const QUICK_LINKS = [
  { href: "/revenue", label: "Revenue", color: "#4f46e5" },
  { href: "/users", label: "Users", color: "#0ea5e9" },
  { href: "/sales", label: "Sales", color: "#f59e0b" },
  { href: "/sessions", label: "Sessions", color: "#10b981" },
  { href: "/reports", label: "Reports", color: "#8b5cf6" },
  { href: "/settings", label: "Settings", color: "#64748b" },
];

const PERIOD_OPTIONS = [7, 14, 30] as const;

export default function DashboardPage() {
  const pathname = usePathname();
  const [period, setPeriod] = useState<number>(14);

  const revenue = useMemo(() => getRevenueSeries(period), [period]);
  const users = useMemo(() => getUsersSeries(period), [period]);
  const sales = useMemo(() => getSalesSeries(period), [period]);
  const sessions = useMemo(() => getSessionsSeries(period), [period]);

  const revStats = useMemo(() => summarize(revenue), [revenue]);
  const userStats = useMemo(() => summarize(users), [users]);
  const salesStats = useMemo(() => summarize(sales), [sales]);
  const sessionStats = useMemo(() => summarize(sessions), [sessions]);

  // Safe fallback in case a series ever comes back empty (e.g. real API, no data yet)
  const latestUsers = users.at(-1)?.value ?? 0;
  const latestSessions = sessions.at(-1)?.value ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Updated just now</p>
        </div>

        {/* Period selector */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 self-start sm:self-auto">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
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
        <Link href="/revenue" aria-label="View revenue details">
          <KpiCard label={`Revenue (${period}d)`} value={money(revStats.total)} changePct={revStats.changePct} />
        </Link>
        <Link href="/users" aria-label="View user details">
          <KpiCard label="Users" value={num(latestUsers)} changePct={userStats.changePct} />
        </Link>
        <Link href="/sales" aria-label="View sales details">
          <KpiCard label={`Sales (${period}d)`} value={num(salesStats.total)} changePct={salesStats.changePct} />
        </Link>
        <Link href="/sessions" aria-label="View session details">
          <KpiCard label="Sessions now" value={num(latestSessions)} changePct={sessionStats.changePct} />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {l.label} →
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section aria-label="Revenue trend chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Revenue trend</h2>
          <MetricChart points={revenue} color="#4f46e5" formatValue={money} />
        </section>
        <section aria-label="User growth chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">User growth</h2>
          <MetricChart points={users} color="#0ea5e9" formatValue={num} />
        </section>
        <section aria-label="Sales volume chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Sales volume</h2>
          <MetricChart points={sales} color="#f59e0b" formatValue={num} />
        </section>
        <section aria-label="Active sessions chart">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Active sessions</h2>
          <MetricChart points={sessions} color="#10b981" formatValue={num} />
        </section>
      </div>

      <div className="w-full max-w-xl">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Ask your data</h2>
        <AnalyticsChat />
      </div>
    </main>
  );
}