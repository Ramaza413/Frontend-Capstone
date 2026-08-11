"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, X, Mail, User as UserIcon, Shield, Check } from "lucide-react";
import { FilterBar, type Period } from "../components/Filterbar";
import { MetricChart } from "../components/MetricChart";
import { ExportButton } from "../components/ExportButton";
import { KpiCard } from "../components/KpiCard";
import { DataTable, StatusPill, type Column } from "../components/DataTable";
import { getUsersSeries, getUserRows, summarize, type UserRow } from "@/lib/ai/mockData";

const num = (v: number) => v.toLocaleString();

const ROLES = ["Admin", "Editor", "Viewer"];

type NewUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

function AddUserModal({
  open,
  onClose,
  onAdd,
  existingEmails,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (u: NewUser) => void;
  existingEmails: string[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  if (!open) return null;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Enter a name.");
    if (!emailValid) return setError("Enter a valid email address.");
    if (existingEmails.includes(email.toLowerCase()))
      return setError("That email is already on this team.");

    setError("");
    onAdd({
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase(),
      role,
      status: "Invited" as const,
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setName("");
      setEmail("");
      setRole("Viewer");
      onClose();
    }, 700);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Add team member</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {justAdded ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check size={20} />
            </div>
            <p className="text-sm font-medium text-slate-700">Invite sent</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Malik"
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <div className="relative">
                <Shield
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Send invite
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [period, setPeriod] = useState<Period>(14);
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState<UserRow[]>(() => getUserRows(10));

  const points = useMemo(() => getUsersSeries(period), [period]);
  const stats = useMemo(() => summarize(points), [points]);

  const activeCount = rows.filter((r) => r.status === "Active").length;

  const columns: Column<UserRow>[] = [
    { key: "id", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "plan", label: "Plan" },
    { key: "role", label: "Role" },
    { key: "joined", label: "Joined" },
    { key: "status", label: "Status", render: (v) => <StatusPill status={v as string} /> },
  ];

  function handleAddUser(newUser: NewUser) {
    const row: UserRow = {
      id: `USR-${newUser.id}`,
      name: newUser.name,
      email: newUser.email,
      plan: "Starter", // new invites start on the base plan
      role: newUser.role as UserRow["role"],
      status: "Invited",
      joined: new Date().toISOString().slice(0, 10),
    };
    setRows((prev) => [row, ...prev]);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <div className="flex items-center gap-3">
          <FilterBar period={period} onChange={setPeriod} />
          <ExportButton data={rows} filename="users" />
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={16} />
            Add user
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard
          label="Total Users"
          value={num(points[points.length - 1].value)}
          changePct={stats.changePct}
        />
        <KpiCard label="Active (sample)" value={num(activeCount)} changePct={stats.changePct} />
        <KpiCard
          label={`Avg / day (${period}d)`}
          value={num(Math.round(stats.average))}
          changePct={stats.changePct}
        />
      </div>

      <div className="mb-6">
        <MetricChart points={points} color="#0ea5e9" formatValue={num} />
      </div>

      <h2 className="text-sm font-semibold text-slate-700 mb-2">Recent users</h2>
      <DataTable rows={rows} columns={columns} />

      <AddUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddUser}
        existingEmails={rows.map((r) => (r.email as string).toLowerCase())}
      />
    </main>
  );
}