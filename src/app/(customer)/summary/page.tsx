"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  Tag,
  User,
} from "lucide-react";
import { Avatar, Button } from "@/components/ui";
import { useDB, useHydrated } from "@/lib/hooks";
import { createBooking } from "@/lib/store";
import type { PaymentMethod } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const PAYMENTS: { key: PaymentMethod; label: string; hint?: string }[] = [
  { key: "UPI", label: "UPI", hint: "GPay, PhonePe, Paytm" },
  { key: "Card", label: "Credit / Debit Card" },
  { key: "Pay at Salon", label: "Pay at Salon" },
];

const PLATFORM_FEE = 20;

export default function SummaryPage() {
  const router = useRouter();
  const db = useDB();
  const hydrated = useHydrated();
  const draft = db.draft;

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("UPI");
  const [processing, setProcessing] = useState(false);

  const salon = db.salons.find((s) => s.id === draft?.salonId);
  const service = db.services.find((s) => s.id === draft?.serviceId);
  const stylist = useMemo(() => {
    if (!salon) return undefined;
    if (draft?.stylistId) {
      return db.stylists.find((s) => s.id === draft.stylistId);
    }
    return db.stylists.find((s) => s.id === salon.stylistIds[0]);
  }, [db.stylists, salon, draft]);

  useEffect(() => {
    if (hydrated && (!draft || !salon || !service)) {
      router.replace("/");
    }
  }, [hydrated, draft, salon, service, router]);

  if (!draft || !salon || !service || !stylist) return null;

  const total = service.price - discount + PLATFORM_FEE;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "GROOM10") {
      const value = Math.round(service.price * 0.1);
      setDiscount(value);
      setCouponMsg(`Coupon applied — you saved ${formatMoney(value)}`);
    } else if (code === "FIRST50") {
      setDiscount(50);
      setCouponMsg("Coupon applied — you saved ₹50");
    } else {
      setDiscount(0);
      setCouponMsg("Invalid coupon code");
    }
  };

  const confirm = () => {
    setProcessing(true);
    const booking = createBooking({
      service,
      stylist,
      salonId: salon.id,
      salonName: salon.name,
      date: draft.date,
      time: draft.time,
      payment,
      discount,
    });
    setTimeout(() => {
      router.push(`/confirmed/${booking.id}`);
    }, 700);
  };

  return (
    <div className="flex min-h-full flex-col lg:mx-auto lg:max-w-5xl lg:pt-2">
      <header className="flex items-center justify-between px-5 pt-6 lg:hidden">
        <button
          onClick={() => router.back()}
          className="grid size-9 place-items-center rounded-full text-ink-800 hover:bg-cream-200"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-base font-semibold text-ink-900">Booking Summary</h1>
        <button className="grid size-9 place-items-center rounded-full text-ink-800 hover:bg-cream-200">
          <Heart className="size-5" />
        </button>
      </header>

      <div className="flex-1 space-y-3.5 px-5 pb-4 pt-4 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-5 lg:space-y-0 lg:px-0 lg:pt-0">
        <div className="contents lg:block lg:space-y-3.5">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/6">
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={salon.image}
                alt={salon.name}
                className="size-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">
                  {salon.name}
                </p>
                <p className="mt-1 flex items-start gap-1 text-[11px] leading-relaxed text-ink-700/60">
                  <MapPin className="mt-0.5 size-3 shrink-0" />
                  {salon.address}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-ink-900/6 pt-3">
              <Avatar src={stylist.avatar} alt={stylist.name} size={40} />
              <div>
                <p className="text-[11px] text-ink-700/60">Stylist</p>
                <p className="text-sm font-medium text-ink-900">
                  {draft.stylistId ? stylist.name : "Any Available Stylist"}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-ink-900/6 pt-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.name}
                  className="size-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-[11px] text-ink-700/60">Service</p>
                  <p className="text-sm font-medium text-ink-900">
                    {service.name}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-ink-900">
                {formatMoney(service.price)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/6">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-ink-700/70">
                <CalendarDays className="size-4 text-gold-500" />
                Date
              </span>
              <span className="font-medium text-ink-900">
                {formatDate(draft.date)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-ink-900/6 pt-3 text-sm">
              <span className="inline-flex items-center gap-2 text-ink-700/70">
                <Clock className="size-4 text-gold-500" />
                Time
              </span>
              <span className="font-medium text-ink-900">{draft.time}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-ink-900/6 pt-3 text-sm">
              <span className="inline-flex items-center gap-2 text-ink-700/70">
                <User className="size-4 text-gold-500" />
                Stylist
              </span>
              <span className="font-medium text-ink-900">
                {draft.stylistId ? stylist.name : "Any Available Stylist"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/6">
            <p className="text-sm font-semibold text-ink-900">Apply Coupon</p>
            <div className="mt-2.5 flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-cream-100 px-3">
                <Tag className="size-4 text-ink-700/50" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full bg-transparent py-2.5 text-sm uppercase outline-none placeholder:normal-case placeholder:text-ink-700/40"
                />
              </div>
              <Button variant="soft" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            {couponMsg && (
              <p
                className={cn(
                  "mt-2 text-[11px] font-medium",
                  discount > 0 ? "text-emerald-600" : "text-red-500",
                )}
              >
                {couponMsg}
              </p>
            )}
            <p className="mt-1 text-[10px] text-ink-700/40">
              Try GROOM10 or FIRST50
            </p>
          </div>
        </div>

        <div className="contents lg:block lg:space-y-3.5">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/6">
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-ink-700/80">
                <span>Service Price</span>
                <span>{formatMoney(service.price)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-{formatMoney(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-ink-700/80">
                <span>Platform Fee</span>
                <span>{formatMoney(PLATFORM_FEE)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-ink-900/8 pt-2.5 text-base font-semibold text-ink-900">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-900/6">
            <p className="text-sm font-semibold text-ink-900">Payment Method</p>
            <div className="mt-2.5 space-y-1.5">
              {PAYMENTS.map((option) => {
                const active = payment === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => setPayment(option.key)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                      active
                        ? "border-gold-400 bg-gold-200/20"
                        : "border-ink-900/8",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-full border",
                        active
                          ? "border-gold-500 bg-gold-500"
                          : "border-ink-900/20",
                      )}
                    >
                      {active && <CheckCircle2 className="size-3.5 text-white" />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-ink-900">
                        {option.label}
                      </span>
                      {option.hint && (
                        <span className="block text-[11px] text-ink-700/50">
                          {option.hint}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={confirm}
            disabled={processing}
            className="hidden h-12 w-full rounded-2xl bg-ink-900 text-[15px] font-semibold text-cream-50 transition hover:bg-ink-800 disabled:opacity-60 lg:flex lg:items-center lg:justify-center"
          >
            {processing
              ? "Confirming..."
              : `Pay & Confirm · ${formatMoney(total)}`}
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-ink-900/8 bg-cream-100/95 px-5 py-4 backdrop-blur lg:hidden">
        <button
          onClick={confirm}
          disabled={processing}
          className="h-12 w-full rounded-2xl bg-ink-900 text-[15px] font-semibold text-cream-50 transition hover:bg-ink-800 disabled:opacity-60"
        >
          {processing ? "Confirming..." : `Pay & Confirm · ${formatMoney(total)}`}
        </button>
      </div>
    </div>
  );
}
