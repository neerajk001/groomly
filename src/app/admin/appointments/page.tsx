"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/stat-card";
import { Avatar, Button, Modal, StatusBadge } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { deleteBooking, updateBookingStatus } from "@/lib/store";
import type { Booking, BookingStatus } from "@/lib/types";
import {
  addDays,
  cn,
  formatDateLong,
  formatMoney,
  parseTime,
  toISO,
  todayISO,
} from "@/lib/utils";

const START_MIN = 9 * 60;
const END_MIN = 18 * 60;
const HOUR = 60;
const HOUR_PX = 62;

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  "In Progress": "bg-amber-100 text-amber-800 border-amber-300",
  Pending: "bg-orange-100 text-orange-800 border-orange-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

const ALL_STATUS: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function AppointmentsPage() {
  const db = useDB();
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [date, setDate] = useState(todayISO());
  const [selected, setSelected] = useState<Booking | null>(null);

  const customerById = (id: string) => db.customers.find((c) => c.id === id);

  const navigate = (dir: number) => {
    if (view === "day") setDate((d) => addDays(d, dir));
    else if (view === "week") setDate((d) => addDays(d, dir * 7));
    else {
      const d = new Date(date + "T00:00:00");
      d.setMonth(d.getMonth() + dir);
      setDate(toISO(d));
    }
  };

  const label = useMemo(() => {
    if (view === "month") {
      const d = new Date(date + "T00:00:00");
      return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }
    return formatDateLong(date);
  }, [date, view]);

  const hours = useMemo(
    () => Array.from({ length: (END_MIN - START_MIN) / HOUR + 1 }, (_, i) => i),
    [],
  );

  const dayBookings = db.bookings.filter((b) => b.date === date);

  const weekStart = useMemo(() => {
    const d = new Date(date + "T00:00:00");
    return addDays(date, -d.getDay());
  }, [date]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const monthCells = useMemo(() => {
    const d = new Date(date + "T00:00:00");
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const start = addDays(toISO(first), -first.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [date]);

  return (
    <div>
      <AdminPageHeader
        title="Appointments"
        description="Schedule, track and update every booking."
        action={
          <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-black/5">
            {(["day", "week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                  view === v
                    ? "bg-ink-900 text-cream-50"
                    : "text-ink-700/60 hover:text-ink-900",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-black/5 bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-gold-500" />
          <span className="text-sm font-semibold text-ink-900">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(-1)}
            className="grid size-8 place-items-center rounded-lg text-ink-700 hover:bg-cream-100"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => setDate(todayISO())}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-700 hover:bg-cream-100"
          >
            Today
          </button>
          <button
            onClick={() => navigate(1)}
            className="grid size-8 place-items-center rounded-lg text-ink-700 hover:bg-cream-100"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {view === "day" && (
        <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[64px_repeat(4,1fr)] border-b border-black/5">
              <div className="px-2 py-3" />
              {db.stylists.slice(0, 4).map((stylist) => (
                <div
                  key={stylist.id}
                  className="flex items-center gap-2 border-l border-black/5 px-3 py-2.5"
                >
                  <Avatar src={stylist.avatar} alt={stylist.name} size={26} />
                  <span className="text-xs font-semibold text-ink-900">
                    {stylist.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative grid grid-cols-[64px_repeat(4,1fr)]">
              <div>
                {hours.map((h) => (
                  <div
                    key={h}
                    style={{ height: HOUR_PX }}
                    className="relative border-b border-black/5 pr-2 text-right"
                  >
                    <span className="absolute -top-2 right-2 text-[10px] font-medium text-ink-700/40">
                      {(() => {
                        const hour24 = 9 + h;
                        const period = hour24 >= 12 ? "PM" : "AM";
                        const display = hour24 % 12 === 0 ? 12 : hour24 % 12;
                        return `${display} ${period}`;
                      })()}
                    </span>
                  </div>
                ))}
              </div>

              {db.stylists.slice(0, 4).map((stylist) => (
                <div key={stylist.id} className="relative border-l border-black/5">
                  {hours.map((h) => (
                    <div
                      key={h}
                      style={{ height: HOUR_PX }}
                      className="border-b border-black/5"
                    />
                  ))}
                  {dayBookings
                    .filter((b) => b.stylistId === stylist.id)
                    .map((booking) => {
                      const start = parseTime(booking.time);
                      const top =
                        ((start - START_MIN) / HOUR) * HOUR_PX + 2;
                      const height =
                        (booking.duration / HOUR) * HOUR_PX - 6;
                      return (
                        <button
                          key={booking.id}
                          onClick={() => setSelected(booking)}
                          style={{ top, height: Math.max(height, 34) }}
                          className={cn(
                            "absolute inset-x-1.5 overflow-hidden rounded-lg border px-2 py-1.5 text-left transition hover:brightness-95",
                            STATUS_STYLES[booking.status],
                          )}
                        >
                          <p className="truncate text-[10px] font-semibold opacity-80">
                            {booking.time}
                          </p>
                          <p className="truncate text-[11px] font-semibold">
                            {booking.customerName}
                          </p>
                          <p className="truncate text-[10px] opacity-75">
                            {booking.serviceName}
                          </p>
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {weekDays.map((iso) => {
            const d = new Date(iso + "T00:00:00");
            const items = db.bookings
              .filter((b) => b.date === iso)
              .sort((a, b) => parseTime(a.time) - parseTime(b.time));
            const isToday = iso === todayISO();
            return (
              <div
                key={iso}
                className={cn(
                  "rounded-2xl border bg-white p-3",
                  isToday ? "border-gold-400" : "border-black/5",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-ink-900">
                    {WEEKDAYS[d.getDay()]}
                  </p>
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full text-[11px] font-semibold",
                      isToday
                        ? "bg-gold-500 text-ink-950"
                        : "text-ink-700/60",
                    )}
                  >
                    {d.getDate()}
                  </span>
                </div>
                <div className="mt-2.5 space-y-1.5">
                  {items.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className={cn(
                        "block w-full truncate rounded-lg border px-2 py-1 text-left text-[10px] font-medium",
                        STATUS_STYLES[b.status],
                      )}
                    >
                      {b.time} · {b.customerName}
                    </button>
                  ))}
                  {items.length === 0 && (
                    <p className="py-2 text-center text-[10px] text-ink-700/35">
                      No bookings
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "month" && (
        <div className="rounded-2xl border border-black/5 bg-white p-3">
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="pb-2 text-center text-[11px] font-medium text-ink-700/45"
              >
                {w}
              </div>
            ))}
            {monthCells.map((iso) => {
              const d = new Date(iso + "T00:00:00");
              const inMonth = d.getMonth() === new Date(date + "T00:00:00").getMonth();
              const count = db.bookings.filter((b) => b.date === iso).length;
              const isToday = iso === todayISO();
              return (
                <button
                  key={iso}
                  onClick={() => {
                    setDate(iso);
                    setView("day");
                  }}
                  className={cn(
                    "flex min-h-16 flex-col items-start gap-1 rounded-xl border p-2 text-left transition hover:bg-cream-50",
                    inMonth ? "border-black/5" : "border-transparent opacity-40",
                    isToday && "border-gold-400 bg-gold-200/20",
                  )}
                >
                  <span className="text-[11px] font-semibold text-ink-900">
                    {d.getDate()}
                  </span>
                  {count > 0 && (
                    <span className="rounded-full bg-ink-900 px-1.5 py-0.5 text-[9px] font-medium text-cream-50">
                      {count} {count === 1 ? "booking" : "bookings"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Booking #${selected.code}` : ""}
        footer={
          selected && (
            <Button
              variant="danger"
              onClick={() => {
                deleteBooking(selected.id);
                setSelected(null);
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={customerById(selected.customerId)?.avatar ?? ""}
                alt={selected.customerName}
                size={44}
              />
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {selected.customerName}
                </p>
                <p className="text-xs text-ink-700/60">
                  {selected.serviceName} · {selected.stylistName}
                </p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-cream-100 p-3 text-xs">
              <div>
                <p className="text-ink-700/50">Date</p>
                <p className="mt-0.5 font-medium text-ink-900">
                  {formatDateLong(selected.date)}
                </p>
              </div>
              <div>
                <p className="text-ink-700/50">Time</p>
                <p className="mt-0.5 inline-flex items-center gap-1 font-medium text-ink-900">
                  <Clock className="size-3" />
                  {selected.time} · {selected.duration}m
                </p>
              </div>
              <div>
                <p className="text-ink-700/50">Payment</p>
                <p className="mt-0.5 font-medium text-ink-900">
                  {selected.payment}
                </p>
              </div>
              <div>
                <p className="text-ink-700/50">Amount</p>
                <p className="mt-0.5 font-medium text-ink-900">
                  {formatMoney(selected.price + selected.platformFee)}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-ink-700">
                Update status
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUS.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      updateBookingStatus(selected.id, status);
                      setSelected({ ...selected, status });
                    }}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition",
                      selected.status === status
                        ? STATUS_STYLES[status]
                        : "border-black/10 text-ink-700 hover:bg-cream-100",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
