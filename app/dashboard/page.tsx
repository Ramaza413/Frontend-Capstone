"use client";

import Link from "next/link";
import { useMemo } from "react";
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

export default function DashboardPage() {
  const period = 14;

  const revenue = useMemo(() => getRevenueSeries(period), []);
  const users = useMemo(() => getUsersSeries(period), []);
  const sales = useMemo(() => getSalesSeries(period), []);
  const sessions = useMemo(() => getSessionsSeries(period), []);

  const revStats = useMemo(() => summarize(revenue), [revenue]);
  const userStats = useMemo(() => summarize(users), [users]);
  const salesStats = useMemo(() => summarize(sales), [sales]);
  const sessionStats = useMemo(() => summarize(sessions), [sessions]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Revenue (14d)" value={money(revStats.total)} changePct={revStats.changePct} />
        <KpiCard label="Users" value={num(users[users.length - 1].value)} changePct={userStats.changePct} />
        <KpiCard label="Sales (14d)" value={num(salesStats.total)} changePct={salesStats.changePct} />
        <KpiCard label="Sessions now" value={num(sessions[sessions.length - 1].value)} changePct={sessionStats.changePct} />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            {l.label} →
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Revenue trend</h2>
          <MetricChart points={revenue} color="#4f46e5" formatValue={money} />
        </section>
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">User growth</h2>
          <MetricChart points={users} color="#0ea5e9" formatValue={num} />
        </section>
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Sales volume</h2>
          <MetricChart points={sales} color="#f59e0b" formatValue={num} />
        </section>
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Active sessions</h2>
          <MetricChart points={sessions} color="#10b981" formatValue={num} />
        </section>
      </div>

      <div className="max-w-xl">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Ask your data</h2>
        <AnalyticsChat />
      </div>
    </main>
  );
}