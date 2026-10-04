"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  IndianRupee,
  Star,
  UserPlus,
} from "lucide-react";
import { AdminPageHeader, StatCard } from "@/components/admin/stat-card";
import { Avatar, StatusBadge } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { formatMoney, parseTime, todayISO, addDays } from "@/lib/utils";

export default function AdminDashboardPage() {
  const db = useDB();
  const today = todayISO();
  const todays = db.bookings
    .filter((b) => b.date === today)
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const revenue = todays
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.price + b.platformFee, 0);
  const newCustomers = db.customers.filter(
    (c) => c.joinedAt >= addDays(today, -30),
  ).length;
  const avgRating =
    db.stylists.reduce((sum, s) => sum + s.rating, 0) /
    Math.max(db.stylists.length, 1);

  const customerById = (id: string) => db.customers.find((c) => c.id === id);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Here's what's happening at your salon today."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Today's Bookings"
          value={String(todays.length)}
          delta="+20% vs yesterday"
          icon={<CalendarDays className="size-4" />}
        />
        <StatCard
          label="Total Revenue"
          value={formatMoney(revenue)}
          delta="+12% vs yesterday"
          icon={<IndianRupee className="size-4" />}
        />
        <StatCard
          label="New Customers"
          value={String(newCustomers)}
          delta="+33% this week"
          icon={<UserPlus className="size-4" />}
        />
        <StatCard
          label="Average Rating"
          value={avgRating.toFixed(1)}
          delta="+0.2 this month"
          icon={<Star className="size-4" />}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-black/5 bg-white">
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-3.5 lg:px-5">
          <div>
            <h2 className="text-sm font-semibold text-ink-900">
              Today&apos;s Appointments
            </h2>
            <p className="text-[11px] text-ink-700/50">
              {todays.length} bookings scheduled
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 hover:underline"
          >
            View All <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-[11px] uppercase tracking-wider text-ink-700/45">
                <th className="px-4 py-2.5 font-medium lg:px-5">Time</th>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Service</th>
                <th className="px-4 py-2.5 font-medium">Stylist</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium lg:px-5">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {todays.map((booking) => {
                const customer = customerById(booking.customerId);
                return (
                  <tr
                    key={booking.id}
                    className="border-b border-black/5 last:border-0 hover:bg-cream-50/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-ink-800 lg:px-5">
                      {booking.time}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={customer?.avatar ?? ""}
                          alt={booking.customerName}
                          size={32}
                        />
                        <div>
                          <p className="text-[13px] font-medium text-ink-900">
                            {booking.customerName}
                          </p>
                          <p className="text-[11px] text-ink-700/50">
                            #{booking.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ink-700">
                      {booking.serviceName}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ink-700">
                      {booking.stylistName}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] font-semibold text-ink-900 lg:px-5">
                      {formatMoney(booking.price + booking.platformFee)}
                    </td>
                  </tr>
                );
              })}
              {todays.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-ink-700/50"
                  >
                    No appointments scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
