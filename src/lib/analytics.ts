import type { DB } from "./types";
import { addDays, todayISO } from "./utils";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export interface TrendPoint {
  label: string;
  bookings: number;
  revenue: number;
}

export function analyticsSummary(db: DB) {
  const today = todayISO();
  const start = addDays(today, -29);
  const period = db.bookings.filter(
    (b) => b.date >= start && b.date <= today && b.status !== "Cancelled",
  );

  const revenue = period.reduce((sum, b) => sum + b.price + b.platformFee, 0);
  const newCustomers = db.customers.filter((c) => c.joinedAt >= start).length;
  const avgRating =
    db.stylists.reduce((sum, s) => sum + s.rating, 0) /
    Math.max(db.stylists.length, 1);

  const buckets = 8;
  const span = 30 / buckets;
  const trend: TrendPoint[] = Array.from({ length: buckets }, (_, i) => {
    const bStart = addDays(today, -29 + Math.round(i * span));
    const bEnd = addDays(today, -29 + Math.round((i + 1) * span) - 1);
    const items = period.filter((b) => b.date >= bStart && b.date <= bEnd);
    const d = new Date(bStart + "T00:00:00");
    return {
      label: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
      bookings: items.length,
      revenue: items.reduce((sum, b) => sum + b.price + b.platformFee, 0),
    };
  });

  const counts = new Map<string, number>();
  for (const b of period) {
    counts.set(b.serviceName, (counts.get(b.serviceName) ?? 0) + 1);
  }
  const total = period.length || 1;
  const popular = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
    }));
  const others = 100 - popular.reduce((sum, p) => sum + p.value, 0);
  if (others > 0) popular.push({ name: "Others", value: others });

  return {
    totalBookings: period.length,
    revenue,
    newCustomers,
    avgRating,
    trend,
    popular,
  };
}
