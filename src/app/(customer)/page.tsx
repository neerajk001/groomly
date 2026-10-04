"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  MapPin,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Avatar, StarRating } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { setDraft } from "@/lib/store";
import { IMG } from "@/lib/seed";
import { formatMoney, todayISO } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const db = useDB();
  const brand = db.salons[0];

  useEffect(() => {
    try {
      if (!window.localStorage.getItem("groomly.onboarded")) {
        router.replace("/onboarding");
      }
    } catch {
      /* ignore */
    }
  }, [router]);

  const startBooking = (serviceId: string) => {
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

  const scrollToServices = () => {
    document
      .getElementById("services")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const featured = db.services.filter((s) => s.status === "Active").slice(0, 6);

  return (
    <div className="pb-6 lg:pb-0">
      <header className="flex items-center justify-between px-5 pt-6 lg:px-0 lg:pt-0">
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-800">
          <MapPin className="size-4 text-gold-500" />
          {brand?.area}, {brand?.city}
        </button>
        <button className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-ink-800 sm:block">
            Hi {db.user.name}
          </span>
          <Avatar src={db.user.avatar} alt={db.user.name} size={36} />
        </button>
      </header>

      {/* Hero */}
      <section className="mt-4 px-5 lg:mt-6 lg:px-0">
        <div className="relative overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG.onboarding}
            alt="Groomly salon"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />
          <div className="relative flex min-h-[460px] flex-col justify-end p-6 lg:min-h-[560px] lg:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold-500/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-300 backdrop-blur">
              <Sparkles className="size-3.5" />
              Look good everyday
            </span>
            <h1 className="mt-4 max-w-xl text-[34px] font-semibold leading-[1.05] tracking-tight text-cream-50 lg:text-6xl">
              Your best look,
              <br />
              every single day.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-200/80 lg:text-base">
              Expert cuts, beard grooming, facials and spa — all at Groomly.
              Book your appointment in under a minute.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/services")}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-cream-50 px-6 text-sm font-semibold text-ink-950 transition hover:bg-white active:scale-[0.99]"
              >
                <Scissors className="size-4" />
                Our Services
              </button>
              <button
                onClick={scrollToServices}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-cream-50/30 bg-cream-50/5 px-6 text-sm font-semibold text-cream-50 backdrop-blur transition hover:bg-cream-50/15 active:scale-[0.99]"
              >
                <CalendarCheck className="size-4" />
                Book Now
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium text-cream-200/75">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3.5 fill-gold-400 text-gold-400" />
                {brand?.rating} ({brand?.reviews} reviews)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-gold-400" />
                Hygienic &amp; safe
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-3.5 text-gold-400" />
                Expert stylists
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section id="services" className="mt-8 px-5 lg:mt-12 lg:px-0">
        <div className="mb-3 flex items-end justify-between lg:mb-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink-900 lg:text-2xl">
              Our Services
            </h2>
            <p className="mt-0.5 text-xs text-ink-700/60 lg:text-sm">
              Signature grooming by Groomly experts
            </p>
          </div>
          <button
            onClick={() => router.push("/services")}
            className="text-xs font-medium text-gold-600 lg:text-sm"
          >
            View all
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
          {featured.map((service) => (
            <button
              key={service.id}
              onClick={() => startBooking(service.id)}
              className="group flex items-center gap-3.5 rounded-2xl bg-white p-3 text-left ring-1 ring-ink-900/6 transition hover:ring-ink-900/15 active:scale-[0.99]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.name}
                className="size-16 rounded-xl object-cover lg:size-20"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900 lg:text-base">
                  {service.name}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink-700/60">
                  <Clock className="size-3" />
                  {service.duration} mins · {service.category}
                </p>
                {service.popular && (
                  <span className="mt-1.5 inline-block rounded-full bg-gold-200/60 px-2 py-0.5 text-[10px] font-medium text-gold-600">
                    Popular
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink-900 lg:text-base">
                  {formatMoney(service.price)}
                </p>
                <span className="mt-1 inline-block text-[11px] font-semibold text-gold-600">
                  Book →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Our Stylists */}
      <section className="mt-8 px-5 lg:mt-12 lg:px-0">
        <h2 className="mb-3 text-lg font-semibold tracking-tight text-ink-900 lg:mb-5 lg:text-2xl">
          Our Stylists
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
          {db.stylists.map((stylist) => (
            <div
              key={stylist.id}
              className="flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-ink-900/6 lg:w-auto"
            >
              <Avatar src={stylist.avatar} alt={stylist.name} size={64} />
              <p className="text-sm font-semibold text-ink-900">
                {stylist.name}
              </p>
              <p className="text-[11px] text-ink-700/60">{stylist.role}</p>
              <StarRating value={stylist.rating} showValue />
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mt-8 lg:mt-12">
        <h2 className="mb-3 px-5 text-lg font-semibold tracking-tight text-ink-900 lg:mb-5 lg:px-0 lg:text-2xl">
          Inside Groomly
        </h2>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4 lg:px-0 lg:overflow-visible">
          {(brand?.gallery ?? []).map((src, i) => (
            <div
              key={i}
              className="size-40 shrink-0 overflow-hidden rounded-2xl lg:aspect-[4/3] lg:size-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Groomly ${i + 1}`}
                className="size-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-8 px-5 lg:mt-12 lg:px-0">
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-8 lg:px-12 lg:py-12">
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-cream-50 lg:text-3xl">
                Ready for a fresh look?
              </h2>
              <p className="mt-1.5 text-sm text-cream-200/70">
                Pick a service and lock your slot in seconds.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/services")}
                className="inline-flex h-12 items-center rounded-2xl border border-cream-50/25 px-6 text-sm font-semibold text-cream-50 transition hover:bg-cream-50/10"
              >
                Our Services
              </button>
              <button
                onClick={() => router.push("/services")}
                className="inline-flex h-12 items-center rounded-2xl bg-cream-50 px-6 text-sm font-semibold text-ink-950 transition hover:bg-white"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
