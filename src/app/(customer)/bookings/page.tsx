"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, MapPin, Scissors } from "lucide-react";
import { Button, EmptyState, StatusBadge } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { updateBookingStatus } from "@/lib/store";
import { cn, formatMoney, todayISO } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function BookingsPage() {
  const db = useDB();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const today = todayISO();

  const mine = useMemo(
    () => db.bookings.filter((b) => b.customerId === "cus_neeraj"),
    [db.bookings],
  );

  const list = useMemo(() => {
    return mine
      .filter((b) => {
        const upcoming = b.date >= today && b.status !== "Cancelled";
        return tab === "upcoming" ? upcoming : !upcoming;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [mine, tab, today]);

  return (
    <div className="px-5 pb-6 pt-6 lg:px-0 lg:pt-0">
      <h1 className="text-[22px] font-semibold tracking-tight text-ink-900 lg:text-2xl">
        My Bookings
      </h1>
      <p className="mt-0.5 text-sm text-ink-700/70">
        Manage your upcoming appointments
      </p>

      <div className="mt-4 flex gap-1 rounded-xl bg-cream-200 p-1 lg:max-w-sm">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium capitalize transition",
              tab === t
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-700/60",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {list.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/6"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {booking.serviceName}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-700/60">
                  #{booking.code}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-ink-700/70">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {booking.salonName}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarCheck className="size-3" />
                {formatDate(booking.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {booking.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Scissors className="size-3" />
                {booking.stylistName}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-ink-900/6 pt-3">
              <span className="text-sm font-semibold text-ink-900">
                {formatMoney(booking.price + booking.platformFee)}
              </span>
              {booking.status !== "Cancelled" &&
                booking.status !== "Completed" &&
                tab === "upcoming" && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      updateBookingStatus(booking.id, "Cancelled")
                    }
                  >
                    Cancel
                  </Button>
                )}
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="lg:col-span-full">
          <EmptyState
            icon={<CalendarCheck className="size-6" />}
            title={tab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
            description="Book a service from a salon near you to get started."
            action={
              <Link href="/">
                <Button size="sm">Explore salons</Button>
              </Link>
            }
          />
          </div>
        )}
      </div>
    </div>
  );
}
