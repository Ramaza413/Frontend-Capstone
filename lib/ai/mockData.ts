// Central mock data for the Revenue / Users / Sales / Sessions pages.
// Swap these for real DB/API calls later — the shapes are the contract.

export type SeriesPoint = { date: string; value: number };

function series(
  days: number,
  base: number,
  growth: number,
  noise: number,
  decimals = 0
): SeriesPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const raw = base + i * growth + (Math.sin(i * 1.3) * noise) / 2 + noise / 4;
    const value = decimals ? +raw.toFixed(decimals) : Math.max(0, Math.round(raw));
    return { date: `Day ${i + 1}`, value };
  });
}

export function getRevenueSeries(days: number) {
  return series(days, 15000, 110, 900);
}
export function getUsersSeries(days: number) {
  return series(days, 2800, 12, 120);
}
export function getSalesSeries(days: number) {
  return series(days, 120, 3, 25);
}
export function getSessionsSeries(days: number) {
  return series(days, 380, 6, 90);
}

export function summarize(points: SeriesPoint[]) {
  const values = points.map((p) => p.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const trend = values[values.length - 1] >= values[0] ? "up" : "down";
  const changePct =
    values[0] === 0 ? 0 : ((values[values.length - 1] - values[0]) / values[0]) * 100;
  return {
    total: +total.toFixed(2),
    average: +average.toFixed(2),
    trend: trend as "up" | "down",
    changePct: +changePct.toFixed(1),
  };
}

// --- Table rows for the "detail" section under each chart ---

export type RevenueRow = {
  id: string;
  customer: string;
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Failed";
};

const CUSTOMERS = [
  "Acme Corp", "Nimbus Labs", "Vertex Studio", "Quantum Retail", "Blue Harbor",
  "Skyline Media", "Pioneer Foods", "Orbit Logistics", "Cedar & Co", "Nova Fitness",
];
const PLANS: RevenueRow["plan"][] = ["Starter", "Growth", "Scale", "Enterprise"];
const REV_STATUS: RevenueRow["status"][] = ["Paid", "Paid", "Paid", "Pending", "Failed"];

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

export type UserRow = {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  status: "Active" | "Invited" | "Suspended";
  joined: string;
};

const NAMES = [
  "Ayesha Khan", "Bilal Ahmed", "Sara Malik", "Usman Tariq", "Hina Raza",
  "Zain Abbas", "Mahnoor Iqbal", "Hamza Sheikh", "Areeba Noor", "Fahad Riaz",
];

export function getUserRows(count = 10): UserRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `USR-${2000 + i}`,
    name: NAMES[i % NAMES.length],
    email: `${NAMES[i % NAMES.length].toLowerCase().replace(" ", ".")}@example.com`,
    plan: PLANS[i % PLANS.length],
    status: i % 7 === 0 ? "Suspended" : i % 4 === 0 ? "Invited" : "Active",
    joined: `2026-0${(i % 8) + 1}-1${i % 9}`,
  }));
}

export type SaleRow = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  date: string;
  status: "Completed" | "Refunded" | "Processing";
};

const PRODUCTS = ["Pro Plan", "Add-on Seats", "API Credits", "Priority Support", "Data Export"];

export function getSaleRows(count = 10): SaleRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${3000 + i}`,
    customer: CUSTOMERS[(i + 3) % CUSTOMERS.length],
    product: PRODUCTS[i % PRODUCTS.length],
    amount: 49 + ((i * 83) % 950),
    date: `2026-08-${String((i % 9) + 1).padStart(2, "0")}`,
    status: i % 9 === 0 ? "Refunded" : i % 5 === 0 ? "Processing" : "Completed",
  }));
}

export type SessionRow = {
  id: string;
  user: string;
  device: "Desktop" | "Mobile" | "Tablet";
  location: string;
  duration: string;
  status: "Active" | "Idle";
};

const LOCATIONS = ["Lahore, PK", "Karachi, PK", "Dubai, AE", "London, UK", "New York, US"];
const DEVICES: SessionRow["device"][] = ["Desktop", "Mobile", "Tablet"];

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