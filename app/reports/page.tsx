"use client";

import { useMemo, useState } from "react";
import { FilterBar, type Period } from "../components/Filterbar";
import { MetricChart } from "../components/MetricChart";
import { ExportButton } from "../components/ExportButton";
import { KpiCard } from "../components/KpiCard";
import {
  getRevenueSeries,
  getUsersSeries,
  getSalesSeries,
  getSessionsSeries,
  summarize,
} from "@/lib/ai/mockData";

const money = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const num = (v: number) => v.toLocaleString();

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>(14);

  const revenue = useMemo(() => getRevenueSeries(period), [period]);
  const users = useMemo(() => getUsersSeries(period), [period]);
  const sales = useMemo(() => getSalesSeries(period), [period]);
  const sessions = useMemo(() => getSessionsSeries(period), [period]);

  const revStats = useMemo(() => summarize(revenue), [revenue]);
  const userStats = useMemo(() => summarize(users), [users]);
  const salesStats = useMemo(() => summarize(sales), [sales]);
  const sessionStats = useMemo(() => summarize(sessions), [sessions]);

  // One combined row per day, ready to export as a single CSV.
  const combinedRows = useMemo(
    () =>
      revenue.map((r, i) => ({
        id: r.date,
        date: r.date,
        revenue: r.value,
        users: users[i]?.value ?? 0,
        sales: sales[i]?.value ?? 0,
        sessions: sessions[i]?.value ?? 0,
      })),
    [revenue, users, sales, sessions]
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <div className="flex items-center gap-3">
          <FilterBar period={period} onChange={setPeriod} />
          <ExportButton data={combinedRows} filename={`report-${period}d`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Revenue" value={money(revStats.total)} changePct={revStats.changePct} />
        <KpiCard label="Users" value={num(users[users.length - 1].value)} changePct={userStats.changePct} />
        <KpiCard label="Sales" value={num(salesStats.total)} changePct={salesStats.changePct} />
        <KpiCard label="Sessions" value={num(sessions[sessions.length - 1].value)} changePct={sessionStats.changePct} />
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

      <h2 className="text-sm font-semibold text-slate-700 mb-2">Daily breakdown ({period} days)</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Revenue</th>
              <th className="px-4 py-2 font-medium">Users</th>
              <th className="px-4 py-2 font-medium">Sales</th>
              <th className="px-4 py-2 font-medium">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {combinedRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-700">{row.date}</td>
                <td className="px-4 py-2 text-slate-700">{money(row.revenue)}</td>
                <td className="px-4 py-2 text-slate-700">{num(row.users)}</td>
                <td className="px-4 py-2 text-slate-700">{num(row.sales)}</td>
                <td className="px-4 py-2 text-slate-700">{num(row.sessions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
