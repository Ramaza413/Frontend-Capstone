"use client";

import { useMemo, useState } from "react";
import { FilterBar, type Period } from "../components/Filterbar";
import { MetricChart } from "../components/MetricChart";
import { ExportButton } from "../components/ExportButton";
import { KpiCard } from "../components/KpiCard";
import { DataTable, StatusPill, type Column } from "../components/DataTable";
import { getSalesSeries, getSaleRows, summarize, type SaleRow } from "@/lib/ai/mockData";

const money = (v: number) =>
  `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function SalesPage() {
  const [period, setPeriod] = useState<Period>(14);

  const points = useMemo(() => getSalesSeries(period), [period]);
  const stats = useMemo(() => summarize(points), [points]);
  const rows = useMemo(() => getSaleRows(10), []);

  const columns: Column<SaleRow>[] = [
    { key: "id", label: "Order" },
    { key: "customer", label: "Customer" },
    { key: "product", label: "Product" },
    { key: "amount", label: "Amount", render: (v) => money(v as number) },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (v) => <StatusPill status={v as string} /> },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Sales</h1>
        <div className="flex items-center gap-3">
          <FilterBar period={period} onChange={setPeriod} />
          <ExportButton data={rows} filename="sales-orders" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Orders today" value={String(points[points.length - 1].value)} changePct={stats.changePct} />
        <KpiCard label={`Total orders (${period}d)`} value={String(stats.total)} changePct={stats.changePct} />
        <KpiCard label={`Avg / day (${period}d)`} value={String(Math.round(stats.average))} changePct={stats.changePct} />
      </div>

      <div className="mb-6">
        <MetricChart points={points} color="#f59e0b" formatValue={(v) => String(v)} />
      </div>

      <h2 className="text-sm font-semibold text-slate-700 mb-2">Recent orders</h2>
      <DataTable rows={rows} columns={columns} />
    </main>
  );
}
