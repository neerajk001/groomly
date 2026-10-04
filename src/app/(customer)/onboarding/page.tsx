"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui";
import { IMG } from "@/lib/seed";

export default function OnboardingPage() {
  const router = useRouter();

  const start = () => {
    try {
      window.localStorage.setItem("groomly.onboarded", "1");
    } catch {
      /* ignore */
    }
    router.push("/");
  };

  return (
    <div className="relative flex min-h-full flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMG.onboarding}
        alt="Barbershop"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/40 to-ink-950/95" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-8 pt-16">
        <Logo light className="animate-fade-up scale-125" />
      </div>

      <div className="relative px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <div className="animate-fade-up mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-cream-50">
            Look good, everyday.
          </h1>
          <p className="mx-auto mt-2 max-w-[300px] text-sm text-cream-200/80">
            Your neighbourhood salon for cuts, beard, facials and spa. Book in
            minutes.
          </p>
        </div>
        <button
          onClick={start}
          className="h-14 w-full rounded-2xl bg-cream-50 text-[15px] font-semibold text-ink-950 transition hover:bg-white active:scale-[0.99]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
