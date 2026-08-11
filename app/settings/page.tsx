"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("Ramaza");
  const [email, setEmail] = useState("ramaza@example.com");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
              />
            </label>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Notifications</h2>
          <div className="space-y-3">
            <ToggleRow
              label="Email alerts"
              description="Get notified about failed payments and account issues."
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <ToggleRow
              label="Weekly digest"
              description="A summary of revenue, users, and sales every Monday."
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
            <ToggleRow
              label="Product updates"
              description="Occasional emails about new dashboard features."
              checked={productUpdates}
              onChange={setProductUpdates}
            />
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Currency
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)]"
              >
                <option value="USD">USD ($)</option>
                <option value="PKR">PKR (₨)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Timezone
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)]"
              >
                <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (ET)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}
