"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Star } from "lucide-react";
import { Logo } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { setDraft } from "@/lib/store";
import { cn, formatMoney, todayISO } from "@/lib/utils";

const FILTERS = ["All", "Haircut", "Beard", "Facial", "Coloring", "Spa"];

export default function ServicesPage() {
  const router = useRouter();
  const db = useDB();
  const brand = db.salons[0];
  const [filter, setFilter] = useState("All");

  const services = db.services.filter(
    (s) => s.status === "Active" && (filter === "All" || s.category === filter),
  );

  const book = (serviceId: string) => {
    if (!brand) return;
    setDraft({
      salonId: brand.id,
      serviceId,
      stylistId: null,
      date: todayISO(),
      time: "",
    });
    router.push(`/booking/${brand.id}`);
  };

  return (
    <div className="flex min-h-full flex-col px-5 pb-6 pt-4 lg:px-0 lg:pt-0">
      <div className="mb-5 flex items-center justify-between lg:hidden">
        <button
          onClick={() => router.back()}
          className="grid size-9 place-items-center rounded-full text-ink-800 hover:bg-cream-200"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <Logo showText={false} />
      </div>

      <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-ink-900 lg:text-3xl">
        Our Services
      </h1>
      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-700/70">
        <Star className="size-3.5 fill-gold-400 text-gold-400" />
        {brand?.rating} · {brand?.reviews} reviews · {brand?.area}
      </p>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-medium ring-1 transition",
              filter === f
                ? "bg-ink-900 text-cream-50 ring-ink-900"
                : "bg-white text-ink-700 ring-ink-900/8 hover:ring-ink-900/20",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/6"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.name}
                className="size-full object-cover"
              />
              {service.popular && (
                <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 text-[10px] font-semibold text-gold-300 backdrop-blur">
                  Popular
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[15px] font-semibold text-ink-900">
                  {service.name}
                </p>
                <span className="text-[15px] font-semibold text-ink-900">
                  {formatMoney(service.price)}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-700/65">
                {service.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-ink-900/6 pt-3">
                <span className="inline-flex items-center gap-1 text-[11px] text-ink-700/60">
                  <Clock className="size-3" />
                  {service.duration} mins · {service.category}
                </span>
                <button
                  onClick={() => book(service.id)}
                  className="rounded-xl bg-ink-900 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-ink-800 active:scale-[0.98]"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
