"use client";

import { useState } from "react";
import { BarChart3, IndianRupee, Star, TrendingUp, UserPlus } from "lucide-react";
import { BookingsTrendChart } from "@/components/admin/charts";
import { AdminPageHeader, StatCard } from "@/components/admin/stat-card";
import { Select } from "@/components/ui";
import { analyticsSummary } from "@/lib/analytics";
import { useDB } from "@/lib/hooks";
import { formatMoney } from "@/lib/utils";

const TONES = ["#bd9448", "#d3af68", "#8b7a5a", "#5c5344", "#c9c2b6"];

export default function AnalyticsPage() {
  const db = useDB();
  const [metric, setMetric] = useState<"bookings" | "revenue">("bookings");
  const stats = analyticsSummary(db);

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Performance overview for the last 30 days."
        action={
          <Select
            value={metric}
            onChange={(e) => setMetric(e.target.value as "bookings" | "revenue")}
            className="w-40 bg-white"
          >
            <option value="bookings">Bookings trend</option>
            <option value="revenue">Revenue trend</option>
          </Select>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={String(stats.totalBookings)}
          delta="+18% vs last period"
          icon={<BarChart3 className="size-4" />}
        />
        <StatCard
          label="Revenue"
          value={formatMoney(stats.revenue)}
          delta="+22% vs last period"
          icon={<IndianRupee className="size-4" />}
        />
        <StatCard
          label="New Customers"
          value={String(stats.newCustomers)}
          delta="+30% vs last period"
          icon={<UserPlus className="size-4" />}
        />
        <StatCard
          label="Avg. Rating"
          value={stats.avgRating.toFixed(1)}
          delta="+0.3 vs last period"
          icon={<Star className="size-4" />}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-4 lg:col-span-2 lg:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink-900">
                {metric === "bookings" ? "Bookings Trend" : "Revenue Trend"}
              </h2>
              <p className="text-[11px] text-ink-700/50">Last 30 days</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
              <TrendingUp className="size-3" />
              Growing
            </span>
          </div>
          <BookingsTrendChart data={stats.trend} metric={metric} />
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 lg:p-5">
          <h2 className="text-sm font-semibold text-ink-900">
            Popular Services
          </h2>
          <p className="text-[11px] text-ink-700/50">Share of total bookings</p>
          <div className="mt-4 space-y-3.5">
            {stats.popular.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-800">{item.name}</span>
                  <span className="text-ink-700/60">{item.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.value}%`,
                      background: TONES[i % TONES.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
