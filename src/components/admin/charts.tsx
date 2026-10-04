"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/analytics";

export function BookingsTrendChart({
  data,
  metric = "bookings",
}: {
  data: TrendPoint[];
  metric?: "bookings" | "revenue";
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient id="groomly-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bd9448" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#bd9448" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="rgba(0,0,0,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "rgba(0,0,0,0.4)" }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "rgba(0,0,0,0.4)" }}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "rgba(0,0,0,0.15)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke="#bd9448"
            strokeWidth={2.5}
            fill="url(#groomly-fill)"
            dot={false}
            activeDot={{ r: 5, fill: "#121110" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
