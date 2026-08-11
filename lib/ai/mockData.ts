
// Central mock data for Revenue / Users / Sales / Sessions / Churn Rate pages.
// This file is the single source of truth for dashboard and AI analytics data.

export type SeriesPoint = {
  date: string;
  value: number;
};

// -----------------------------------------------------------------------------
// Analytics Series
// -----------------------------------------------------------------------------

function series(
  days: number,
  base: number,
  growth: number,
  noise: number,
  decimals = 0
): SeriesPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const raw =
      base +
      i * growth +
      (Math.sin(i * 1.3) * noise) / 2 +
      noise / 4;

    const value = decimals
      ? +raw.toFixed(decimals)
      : Math.max(0, Math.round(raw));

    return {
      date: `Day ${i + 1}`,
      value,
    };
  });
}

export function getRevenueSeries(days: number): SeriesPoint[] {
  return series(days, 15000, 110, 900);
}

export function getUsersSeries(days: number): SeriesPoint[] {
  return series(days, 2800, 12, 120);
}

export function getSalesSeries(days: number): SeriesPoint[] {
  return series(days, 120, 3, 25);
}

export function getSessionsSeries(days: number): SeriesPoint[] {
  return series(days, 380, 6, 90);
}

// Deterministic churn-rate data for the AI analytics tool.
export function getChurnRateSeries(days: number): SeriesPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const value = 2.8 - i * 0.02;

    return {
      date: `Day ${i + 1}`,
      value: Math.max(0, +value.toFixed(2)),
    };
  });
}

// -----------------------------------------------------------------------------
// Analytics Summary
// -----------------------------------------------------------------------------

export function summarize(points: SeriesPoint[]) {
  if (points.length === 0) {
    return {
      total: 0,
      average: 0,
      trend: "up" as "up" | "down",
      changePct: 0,
    };
  }

  const values = points.map((p) => p.value);

  const total = values.reduce((a, b) => a + b, 0);

  const average = total / values.length;

  const trend =
    values[values.length - 1] >= values[0] ? "up" : "down";

  const changePct =
    values[0] === 0
      ? 0
      : ((values[values.length - 1] - values[0]) / values[0]) * 100;

  return {
    total: +total.toFixed(2),
    average: +average.toFixed(2),
    trend,
    changePct: +changePct.toFixed(1),
  };
}

// -----------------------------------------------------------------------------
// Revenue Table Rows
// -----------------------------------------------------------------------------

export type RevenueRow = {
  id: string;
  customer: string;
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Failed";
};

const CUSTOMERS = [
  "Acme Corp",
  "Nimbus Labs",
  "Vertex Studio",
  "Quantum Retail",
  "Blue Harbor",
  "Skyline Media",
  "Pioneer Foods",
  "Orbit Logistics",
  "Cedar & Co",
  "Nova Fitness",
];

const PLANS: RevenueRow["plan"][] = [
  "Starter",
  "Growth",
  "Scale",
  "Enterprise",
];

const REV_STATUS: RevenueRow["status"][] = [
  "Paid",
  "Paid",
  "Paid",
  "Pending",
  "Failed",
];

export function getRevenueRows(count = 10): RevenueRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `INV-${1000 + i}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    plan: PLANS[i % PLANS.length],
    amount: 200 + ((i * 137) % 1800),
    date: `2026-08-${String((i % 9) + 1).padStart(2, "0")}`,
    status: REV_STATUS[i % REV_STATUS.length],
  }));
}

// -----------------------------------------------------------------------------
// User Table Rows
// -----------------------------------------------------------------------------

export type UserRow = {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited" | "Suspended";
  joined: string;
};

const NAMES = [
  "Ayesha Khan",
  "Bilal Ahmed",
  "Sara Malik",
  "Usman Tariq",
  "Hina Raza",
  "Zain Abbas",
  "Mahnoor Iqbal",
  "Hamza Sheikh",
  "Areeba Noor",
  "Fahad Riaz",
];

const ROLES: UserRow["role"][] = [
  "Admin",
  "Editor",
  "Viewer",
];

export function getUserRows(count = 10): UserRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `USR-${2000 + i}`,
    name: NAMES[i % NAMES.length],
    email: `${NAMES[i % NAMES.length]
      .toLowerCase()
      .replace(" ", ".")}@example.com`,
    plan: PLANS[i % PLANS.length],
    role: ROLES[i % ROLES.length],
    status:
      i % 7 === 0
        ? "Suspended"
        : i % 4 === 0
        ? "Invited"
        : "Active",
    joined: `2026-0${(i % 8) + 1}-1${i % 9}`,
  }));
}

// -----------------------------------------------------------------------------
// Sales Table Rows
// -----------------------------------------------------------------------------

export type SaleRow = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  date: string;
  status: "Completed" | "Refunded" | "Processing";
};

const PRODUCTS = [
  "Pro Plan",
  "Add-on Seats",
  "API Credits",
  "Priority Support",
  "Data Export",
];

export function getSaleRows(count = 10): SaleRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${3000 + i}`,
    customer: CUSTOMERS[(i + 3) % CUSTOMERS.length],
    product: PRODUCTS[i % PRODUCTS.length],
    amount: 49 + ((i * 83) % 950),
    date: `2026-08-${String((i % 9) + 1).padStart(2, "0")}`,
    status:
      i % 9 === 0
        ? "Refunded"
        : i % 5 === 0
        ? "Processing"
        : "Completed",
  }));
}

// -----------------------------------------------------------------------------
// Session Table Rows
// -----------------------------------------------------------------------------

export type SessionRow = {
  id: string;
  user: string;
  device: "Desktop" | "Mobile" | "Tablet";
  location: string;
  duration: string;
  status: "Active" | "Idle";
};

const LOCATIONS = [
  "Lahore, PK",
  "Karachi, PK",
  "Dubai, AE",
  "London, UK",
  "New York, US",
];

const DEVICES: SessionRow["device"][] = [
  "Desktop",
  "Mobile",
  "Tablet",
];

export function getSessionRows(count = 10): SessionRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `SES-${4000 + i}`,
    user: NAMES[(i + 2) % NAMES.length],
    device: DEVICES[i % DEVICES.length],
    location: LOCATIONS[i % LOCATIONS.length],
    duration: `${5 + ((i * 7) % 40)}m`,
    status: i % 3 === 0 ? "Idle" : "Active",
  }));
}
