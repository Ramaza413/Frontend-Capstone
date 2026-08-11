"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  FileText,
  Settings,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/revenue", label: "Revenue", icon: DollarSign },
  { href: "/users", label: "Users", icon: Users },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/sessions", label: "Sessions", icon: Activity },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/health", label: "Health", icon: HeartPulse },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          SaaS Analytics
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                isActive(href)
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" aria-hidden />}
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden p-2 rounded-md hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-1 border-t border-slate-800">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                isActive(href)
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" aria-hidden />}
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}