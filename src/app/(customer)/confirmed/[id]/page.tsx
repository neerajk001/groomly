"use client";

import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Scissors,
  Wallet,
} from "lucide-react";
import { useDB, useHydrated } from "@/lib/hooks";
import { formatMoney } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ConfirmedPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const db = useDB();
  const hydrated = useHydrated();
  const booking = db.bookings.find((b) => b.id === params.id);
  const salon = db.salons.find((s) => s.id === booking?.salonId);

  if (!hydrated) return null;

  if (!booking) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm font-medium text-ink-800">Booking not found</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-xl bg-ink-900 px-4 py-2 text-sm text-cream-50"
        >
          Back home
        </button>
      </div>
    );
  }

  const total = booking.price + booking.platformFee;

  return (
    <div className="flex min-h-full flex-col px-5 pb-6 pt-10 lg:px-0 lg:pt-0">
      <div className="flex flex-col items-center text-center">
        <div className="animate-pop grid size-20 place-items-center rounded-full bg-emerald-100">
          <div className="grid size-14 place-items-center rounded-full bg-emerald-500">
            <Check className="size-8 text-white" strokeWidth={3} />
          </div>
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">
          Booking Confirmed!
        </h1>
        <p className="mt-1.5 text-sm text-ink-700/70">
          Your appointment is scheduled.
        </p>
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/6">
        {salon && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={salon.image}
              alt={salon.name}
              className="h-32 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm font-semibold text-ink-900">{salon.name}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-700/60">
                <MapPin className="size-3" />
                {salon.address}
              </p>
            </div>
          </>
        )}

        <div className="space-y-3 border-t border-ink-900/6 p-4 text-sm">
          <Row
            icon={<Scissors className="size-4 text-gold-500" />}
            label="Service"
            value={booking.serviceName}
          />
          <Row
            icon={<CalendarDays className="size-4 text-gold-500" />}
            label="Date"
            value={formatDate(booking.date)}
          />
          <Row
            icon={<Clock className="size-4 text-gold-500" />}
            label="Time"
            value={booking.time}
          />
          <Row
            icon={<Wallet className="size-4 text-gold-500" />}
            label="Total"
            value={formatMoney(total)}
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="mt-6 space-y-2.5">
        <button
          onClick={() => router.push("/bookings")}
          className="h-12 w-full rounded-2xl bg-ink-900 text-[15px] font-semibold text-cream-50 transition hover:bg-ink-800"
        >
          View Booking
        </button>
        <button
          onClick={() => router.push("/")}
          className="h-12 w-full rounded-2xl border border-ink-900/12 bg-white text-[15px] font-semibold text-ink-900 transition hover:bg-cream-100"
        >
          Add to Calendar
        </button>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-ink-700/70">
        {icon}
        {label}
      </span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
