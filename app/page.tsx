import Link from "next/link";

const SECTIONS = [
  {
    href: "/revenue",
    title: "Revenue",
    description: "MRR trend, invoices, and payment status at a glance.",
    color: "#4f46e5",
  },
  {
    href: "/users",
    title: "Users",
    description: "Growth over time and a breakdown of every account.",
    color: "#0ea5e9",
  },
  {
    href: "/sales",
    title: "Sales",
    description: "Daily order volume and recent transactions.",
    color: "#f59e0b",
  },
  {
    href: "/sessions",
    title: "Active Sessions",
    description: "Who's online right now, device, and location.",
    color: "#10b981",
  },
  {
    href: "/reports",
    title: "Reports",
    description: "Combined revenue, users, sales, and sessions in one export.",
    color: "#8b5cf6",
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Profile, notifications, and preferences.",
    color: "#64748b",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="px-6 md:px-10 pt-16 pb-12 max-w-3xl">
        <p className="text-xs font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
          SaaS Analytics
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          One dashboard for revenue, users, and everything in between.
        </h1>
        <p className="text-slate-600 mb-8">
          Track how the business is doing, dig into the numbers, and export
          what you need — or just ask the built-in assistant.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Go to Dashboard
          <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full mb-3"
                style={{ backgroundColor: s.color }}
              />
              <h2 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-1">
                {s.title}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </h2>
              <p className="text-xs text-slate-500">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}