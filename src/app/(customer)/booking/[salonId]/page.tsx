"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Heart, MapPin } from "lucide-react";
import { useDB, useHydrated } from "@/lib/hooks";
import { updateDraft } from "@/lib/store";
import { addDays, cn, formatMoney, todayISO } from "@/lib/utils";

function to12h(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${String(minute).padStart(2, "0")} ${period}`;
}

function buildSlots(openHour = 9, closeHour = 21) {
  const groups: { label: string; slots: string[] }[] = [
    { label: "Morning", slots: [] },
    { label: "Afternoon", slots: [] },
    { label: "Evening", slots: [] },
  ];
  for (let h = openHour; h < closeHour; h++) {
    for (const m of [0, 30]) {
      const label = to12h(h, m);
      if (h < 12) groups[0].slots.push(label);
      else if (h < 17) groups[1].slots.push(label);
      else groups[2].slots.push(label);
    }
  }
  return groups;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function SelectDateTimePage() {
  const params = useParams<{ salonId: string }>();
  const router = useRouter();
  const db = useDB();
  const hydrated = useHydrated();
  const [time, setTime] = useState("");

  const salon = db.salons.find((s) => s.id === params.salonId);
  const draft = db.draft;
  const service = db.services.find((s) => s.id === draft?.serviceId);
  const [date, setDate] = useState(draft?.date ?? todayISO());

  const days = useMemo(() => {
    const base = todayISO();
    return Array.from({ length: 14 }, (_, i) => {
      const iso = addDays(base, i);
      const d = new Date(iso + "T00:00:00");
      return { iso, weekday: WEEKDAYS[d.getDay()], day: d.getDate() };
    });
  }, []);

  const groups = useMemo(() => buildSlots(), []);
  const selectedDate = new Date(date + "T00:00:00");

  useEffect(() => {
    if (hydrated && (!draft || draft.salonId !== params.salonId)) {
      router.replace("/");
    }
  }, [hydrated, draft, params.salonId, router]);

  if (!salon || !draft || !service) return null;

  const proceed = () => {
    if (!time) return;
    updateDraft({ date, time });
    router.push("/summary");
  };

  return (
    <div className="flex min-h-full flex-col lg:mx-auto lg:max-w-3xl lg:pt-2">
      <header className="flex items-center justify-between px-5 pt-6 lg:hidden">
        <button
          onClick={() => router.back()}
          className="grid size-9 place-items-center rounded-full text-ink-800 hover:bg-cream-200"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-base font-semibold text-ink-900">
          Select Date &amp; Time
        </h1>
        <button className="grid size-9 place-items-center rounded-full text-ink-800 hover:bg-cream-200">
          <Heart className="size-5" />
        </button>
      </header>

      <div className="mx-5 mt-4 rounded-2xl bg-white p-3.5 ring-1 ring-ink-900/6 lg:mx-0 lg:mt-0">
        <p className="text-sm font-semibold text-ink-900">{salon.name}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-700/60">
          <MapPin className="size-3" />
          {salon.address}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-ink-900/6 pt-3">
          <span className="text-xs text-ink-700/70">{service.name}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-900">
            <Clock className="size-3" />
            {service.duration} mins · {formatMoney(service.price)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex gap-2.5 overflow-x-auto px-5 no-scrollbar lg:px-0">
        {days.map((d) => {
          const active = d.iso === date;
          return (
            <button
              key={d.iso}
              onClick={() => setDate(d.iso)}
              className={cn(
                "flex w-14 shrink-0 flex-col items-center gap-1 rounded-2xl py-2.5 ring-1 transition",
                active
                  ? "bg-ink-900 text-cream-50 ring-ink-900"
                  : "bg-white text-ink-800 ring-ink-900/8",
              )}
            >
              <span className="text-[11px] opacity-70">{d.weekday}</span>
              <span className="text-base font-semibold">{d.day}</span>
              <span className="text-[10px] opacity-60">
                {MONTHS[selectedDate.getMonth()]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex-1 space-y-6 px-5 lg:px-0">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-700/50">
              {group.label}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {group.slots.map((slot) => {
                const active = time === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={cn(
                      "rounded-xl py-2.5 text-xs font-medium ring-1 transition",
                      active
                        ? "bg-ink-900 text-cream-50 ring-ink-900"
                        : "bg-white text-ink-800 ring-ink-900/8 hover:ring-ink-900/20",
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 hidden lg:block">
        <button
          onClick={proceed}
          disabled={!time}
          className="h-12 w-full rounded-2xl bg-ink-900 text-[15px] font-semibold text-cream-50 transition hover:bg-ink-800 disabled:opacity-40"
        >
          {time ? `Continue · ${time}` : "Select a time slot"}
        </button>
      </div>

      <div className="sticky bottom-0 mt-6 border-t border-ink-900/8 bg-cream-100/95 px-5 py-4 backdrop-blur lg:hidden">
        <button
          onClick={proceed}
          disabled={!time}
          className="h-12 w-full rounded-2xl bg-ink-900 text-[15px] font-semibold text-cream-50 transition disabled:opacity-40"
        >
          {time ? `Continue · ${time}` : "Select a time slot"}
        </button>
      </div>
    </div>
  );
}
