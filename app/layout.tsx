import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "SaaS Analytics Dashboard",
  description: "Frontend Capstone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="flex flex-wrap gap-4 border-b p-4 bg-slate-900 text-white">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/revenue">Revenue</Link>
          <Link href="/users">Users</Link>
          <Link href="/sales">Sales</Link>
          <Link href="/sessions">Sessions</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/health">Health</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}