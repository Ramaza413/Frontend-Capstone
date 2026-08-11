"use client";

import { useMemo, useState } from "react";
import { FilterBar, type Period } from "../components/Filterbar";
import { MetricChart } from "../components/MetricChart";
import { ExportButton } from "../components/ExportButton";
import { KpiCard } from "../components/KpiCard";
import { DataTable, StatusPill, type Column } from "../components/DataTable";
import { getRevenueSeries, getRevenueRows, summarize, type RevenueRow } from "@/lib/ai/mockData";

const money = (v: number) =>
  `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>(14);

  const points = useMemo(() => getRevenueSeries(period), [period]);
  const stats = useMemo(() => summarize(points), [points]);
  const rows = useMemo(() => getRevenueRows(10), []);

  const columns: Column<RevenueRow>[] = [
    { key: "id", label: "Invoice" },
    { key: "customer", label: "Customer" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount", render: (v) => money(v as number) },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (v) => <StatusPill status={v as string} /> },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Revenue</h1>
        <div className="flex items-center gap-3">
          <FilterBar period={period} onChange={setPeriod} />
          <ExportButton data={rows} filename="revenue-invoices" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard label="MRR" value={money(points[points.length - 1].value)} changePct={stats.changePct} />
        <KpiCard label={`Total (${period}d)`} value={money(stats.total)} changePct={stats.changePct} />
        <KpiCard label={`Avg / day (${period}d)`} value={money(stats.average)} changePct={stats.changePct} />
      </div>

      <div className="mb-6">
        <MetricChart points={points} color="#4f46e5" formatValue={money} />
      </div>

      <h2 className="text-sm font-semibold text-slate-700 mb-2">Recent invoices</h2>
      <DataTable rows={rows} columns={columns} />
    </main>
  );
}
