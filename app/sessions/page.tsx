"use client";

import { useMemo, useState } from "react";
import { FilterBar, type Period } from "../components/Filterbar";
import { MetricChart } from "../components/MetricChart";
import { ExportButton } from "../components/ExportButton";
import { KpiCard } from "../components/KpiCard";
import { DataTable, StatusPill, type Column } from "../components/DataTable";
import { getSessionsSeries, getSessionRows, summarize, type SessionRow } from "@/lib/ai/mockData";

const num = (v: number) => v.toLocaleString();

export default function SessionsPage() {
  const [period, setPeriod] = useState<Period>(14);

  const points = useMemo(() => getSessionsSeries(period), [period]);
  const stats = useMemo(() => summarize(points), [points]);
  const rows = useMemo(() => getSessionRows(10), []);

  const activeNow = rows.filter((r) => r.status === "Active").length;

  const columns: Column<SessionRow>[] = [
    { key: "id", label: "Session" },
    { key: "user", label: "User" },
    { key: "device", label: "Device" },
    { key: "location", label: "Location" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status", render: (v) => <StatusPill status={v as string} /> },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Active Sessions</h1>
        <div className="flex items-center gap-3">
          <FilterBar period={period} onChange={setPeriod} />
          <ExportButton data={rows} filename="active-sessions" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Sessions right now" value={num(points[points.length - 1].value)} changePct={stats.changePct} />
        <KpiCard label="Active (sample)" value={num(activeNow)} changePct={stats.changePct} />
        <KpiCard label={`Avg / day (${period}d)`} value={num(Math.round(stats.average))} changePct={stats.changePct} />
      </div>

      <div className="mb-6">
        <MetricChart points={points} color="#10b981" formatValue={num} />
      </div>

      <h2 className="text-sm font-semibold text-slate-700 mb-2">Live sessions</h2>
      <DataTable rows={rows} columns={columns} />
    </main>
  );
}
