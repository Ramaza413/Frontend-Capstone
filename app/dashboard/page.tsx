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
  {
    href: "/revenue",
    label: "Revenue",
    description: "Track revenue performance",
    icon: "↗",
  },
  {
    href: "/users",
    label: "Users",
    description: "Monitor user activity",
    icon: "◉",
  },
  {
    href: "/sales",
    label: "Sales",
    description: "Analyze sales trends",
    icon: "▣",
  },
  {
    href: "/sessions",
    label: "Sessions",
    description: "View session activity",
    icon: "◌",
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Explore detailed reports",
    icon: "▤",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Manage dashboard settings",
    icon: "⚙",
  },
];

const PERIOD_OPTIONS = [7, 14, 30] as const;

type Period = (typeof PERIOD_OPTIONS)[number];

function formatChange(changePct: number) {
  if (!Number.isFinite(changePct)) {
    return "0%";
  }

  const sign = changePct > 0 ? "+" : "";

  return `${sign}${changePct.toFixed(1)}%`;
}

function TrendBadge({ value }: { value: number }) {
  const positive = value > 0;
  const negative = value < 0;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : negative
            ? "bg-rose-50 text-rose-700"
            : "bg-slate-100 text-slate-600"
      }`}
    >
      {positive ? "↑" : negative ? "↓" : "→"}{" "}
      {formatChange(Math.abs(value))}
    </span>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const latestUsers = users.at(-1)?.value ?? 0;
  const latestSessions = sessions.at(-1)?.value ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm text-white">
                  ✦
                </span>

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Analytics
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>

              <p className="mt-1.5 max-w-xl text-sm text-slate-500">
                Monitor your key business metrics and discover insights from
                your data.
              </p>

              <p
                className="mt-2 text-xs text-slate-400"
                aria-live="polite"
              >
                {lastUpdated
                  ? `Last updated at ${lastUpdated}`
                  : "Updating dashboard…"}
              </p>
            </div>

            {/* Period Selector */}
            <div
              role="group"
              aria-label="Select analytics time period"
              className="inline-flex w-fit rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm"
            >
              {PERIOD_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  aria-pressed={period === p}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                    period === p
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {p} days
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <section
          aria-label="Key performance indicators"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Link
            href="/revenue"
            aria-label="View revenue details"
            className="group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <KpiCard
                label={`Revenue (${period}d)`}
                value={money(revStats.total)}
                changePct={revStats.changePct}
              />
            </div>
          </Link>

          <Link
            href="/users"
            aria-label="View user details"
            className="group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <KpiCard
                label="Users"
                value={num(latestUsers)}
                changePct={userStats.changePct}
              />
            </div>
          </Link>

          <Link
            href="/sales"
            aria-label="View sales details"
            className="group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <KpiCard
                label={`Sales (${period}d)`}
                value={num(salesStats.total)}
                changePct={salesStats.changePct}
              />
            </div>
          </Link>

          <Link
            href="/sessions"
            aria-label="View session details"
            className="group rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <KpiCard
                label="Sessions now"
                value={num(latestSessions)}
                changePct={sessionStats.changePct}
              />
            </div>
          </Link>
        </section>

        {/* Quick Navigation */}
        <section aria-label="Analytics navigation" className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Explore analytics
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Jump directly to a metric
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                  {link.icon}
                </div>

                <p className="text-xs font-semibold text-slate-800">
                  {link.label}
                </p>

                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Charts */}
        <section aria-label="Analytics charts" className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Performance overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track how your core metrics are changing over the selected
              period.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Revenue */}
            <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Revenue
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {money(revStats.total)}
                  </h3>
                </div>

                <TrendBadge value={revStats.changePct} />
              </div>

              <div className="min-w-0">
                <MetricChart
                  points={revenue}
                  color="#4f46e5"
                  formatValue={money}
                />
              </div>
            </article>

            {/* Users */}
            <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Active users
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {num(latestUsers)}
                  </h3>
                </div>

                <TrendBadge value={userStats.changePct} />
              </div>

              <div className="min-w-0">
                <MetricChart
                  points={users}
                  color="#0ea5e9"
                  formatValue={num}
                />
              </div>
            </article>

            {/* Sales */}
            <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Sales volume
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {num(salesStats.total)}
                  </h3>
                </div>

                <TrendBadge value={salesStats.changePct} />
              </div>

              <div className="min-w-0">
                <MetricChart
                  points={sales}
                  color="#f59e0b"
                  formatValue={num}
                />
              </div>
            </article>

            {/* Sessions */}
            <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Active sessions
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {num(latestSessions)}
                  </h3>
                </div>

                <TrendBadge value={sessionStats.changePct} />
              </div>

              <div className="min-w-0">
                <MetricChart
                  points={sessions}
                  color="#10b981"
                  formatValue={num}
                />
              </div>
            </article>
          </div>
        </section>

        {/* AI Analytics Assistant */}
       <section
  aria-label="AI analytics assistant"
  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
>
  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-6">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg text-white shadow-sm">
        ✦
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">
            AI Analytics Assistant
          </h2>

          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            AI
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Ask questions about your metrics and get data-driven insights.
        </p>
      </div>
    </div>
  </div>

  <div className="p-4 sm:p-6">
    <AnalyticsChat />
  </div>
</section>
        {/* Footer */}
        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400">
            Analytics dashboard · {period}-day view
          </p>

          <p className="text-xs text-slate-400">
            Data updates automatically when the selected period changes.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="animate-pulse">
              <div className="h-8 w-40 rounded-lg bg-slate-200" />
              <div className="mt-3 h-4 w-72 rounded bg-slate-200" />

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-32 rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-80 rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}