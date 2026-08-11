import Link from "next/link";
import {
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  FileText,
  Settings,
  ArrowRight,
} from "lucide-react";

const SECTIONS = [
  {
    href: "/revenue",
    title: "Revenue",
    description: "MRR trend, invoices, and payment status at a glance.",
    color: "#4f46e5",
    bg: "#eef2ff",
    icon: DollarSign,
  },
  {
    href: "/users",
    title: "Users",
    description: "Growth over time and a breakdown of every account.",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    icon: Users,
  },
  {
    href: "/sales",
    title: "Sales",
    description: "Daily order volume and recent transactions.",
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: ShoppingCart,
  },
  {
    href: "/sessions",
    title: "Active Sessions",
    description: "Who's online right now, device, and location.",
    color: "#10b981",
    bg: "#ecfdf5",
    icon: Activity,
  },
  {
    href: "/reports",
    title: "Reports",
    description: "Combined revenue, users, sales, and sessions in one export.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    icon: FileText,
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Profile, notifications, and preferences.",
    color: "#64748b",
    bg: "#f8fafc",
    icon: Settings,
  },
];

// Replace with real numbers from your data source — shown here so the
// landing page doesn't feel empty before a user has explored anything.
const QUICK_STATS = [
  { label: "MRR", value: "$84.2k", delta: "+4.6%" },
  { label: "Active Users", value: "12,480", delta: "+2.1%" },
  { label: "Orders Today", value: "312", delta: "+18%" },
  { label: "Live Sessions", value: "94", delta: null },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="px-6 md:px-10 pt-16 pb-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
          One dashboard for revenue, users, and everything in between.
        </h1>
        <p className="text-slate-600 mb-8 text-base leading-relaxed">
          Track how the business is doing, dig into the numbers, and export
          what you need — or just ask the built-in assistant.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Sample Report
          </Link>
        </div>
      </section>

      {/* Quick stats strip — gives new visitors an instant sense of the data */}
      <section className="px-6 md:px-10 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
          {QUICK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-slate-200 p-4"
            >
              <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold text-slate-900">
                  {stat.value}
                </span>
                {stat.delta && (
                  <span className="text-xs font-medium text-emerald-600">
                    {stat.delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section cards */}
      <section className="px-6 md:px-10 pb-16">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Explore
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-label={`Open ${s.title}: ${s.description}`}
                className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3"
                  style={{ backgroundColor: s.bg }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: s.color }} aria-hidden />
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-1">
                  {s.title}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-6 border-t border-slate-200">
        <p className="text-xs text-slate-400">
          SaaS Analytics Dashboard — built with Next.js.
        </p>
      </footer>
    </main>
  );
}