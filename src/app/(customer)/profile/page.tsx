"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  ChevronRight,
  Download,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Scissors,
  Smartphone,
  Star,
} from "lucide-react";
import { Avatar, Badge, Button } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { resetDemo } from "@/lib/store";

export default function ProfilePage() {
  const db = useDB();
  const router = useRouter();

  const myBookings = db.bookings.filter((b) => b.customerId === "cus_neeraj");

  const handleReset = () => {
    if (window.confirm("Reset all demo data back to the original seed?")) {
      resetDemo();
      router.push("/");
    }
  };

  return (
    <div className="pb-6 lg:mx-auto lg:max-w-4xl">
      <div className="relative overflow-hidden bg-ink-950 px-5 pb-14 pt-10 lg:rounded-3xl lg:px-10 lg:pt-12">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-gold-500/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <Avatar
            src={db.user.avatar}
            alt={db.user.name}
            size={64}
            className="ring-2 ring-gold-400/50"
          />
          <div>
            <h1 className="text-lg font-semibold text-cream-50">
              {db.user.name}
            </h1>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-cream-200/70">
              <MapPin className="size-3" />
              {db.user.city}
            </p>
            <Badge tone="gold" className="mt-2">
              Member
            </Badge>
          </div>
        </div>
      </div>

      <div className="-mt-8 px-5 lg:px-10">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 ring-1 ring-ink-900/6">
          {[
            { label: "Bookings", value: myBookings.length },
            {
              label: "Visits",
              value: db.customers.find((c) => c.id === "cus_neeraj")?.visits ?? 0,
            },
            { label: "Rating", value: db.salons[0]?.rating ?? 4.8 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-semibold text-ink-900">{stat.value}</p>
              <p className="text-[11px] text-ink-700/60">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-ink-900/6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-700/50">
            Contact
          </p>
          <div className="mt-3 space-y-2.5 text-sm">
            <p className="flex items-center gap-2 text-ink-800">
              <Mail className="size-4 text-gold-500" />
              {db.user.email}
            </p>
            <p className="flex items-center gap-2 text-ink-800">
              <Phone className="size-4 text-gold-500" />
              {db.user.phone}
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/6">
          <MenuItem
            href="/bookings"
            icon={<CalendarCheck className="size-4" />}
            label="My Bookings"
          />
          <MenuItem
            href="/services"
            icon={<Scissors className="size-4" />}
            label="Our Services"
          />
          <MenuItem
            href="/onboarding"
            icon={<Smartphone className="size-4" />}
            label="App intro"
          />
          <MenuItem
            href="/admin"
            icon={<LayoutDashboard className="size-4" />}
            label="Salon Admin Dashboard"
            external
          />
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-ink-900/6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-700/50">
            <Star className="size-3.5 fill-gold-400 text-gold-400" />
            Groomly Membership
          </p>
          <p className="mt-2 text-sm text-ink-700/75">
            You&apos;re a Member — earn rewards on every visit and get priority
            slots at Groomly.
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-900/6">
          <button
            onClick={() => window.alert("Tip: use your browser menu → 'Install app' to add Groomly to your home screen.")}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm text-ink-800 transition hover:bg-cream-100"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-cream-200 text-ink-800">
              <Download className="size-4" />
            </span>
            <span className="flex-1">Install app</span>
            <ChevronRight className="size-4 text-ink-700/40" />
          </button>
          <button
            onClick={handleReset}
            className="flex w-full items-center gap-3 border-t border-ink-900/6 px-4 py-3.5 text-left text-sm text-ink-800 transition hover:bg-cream-100"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-cream-200 text-ink-800">
              <RefreshCw className="size-4" />
            </span>
            <span className="flex-1">Reset demo data</span>
            <ChevronRight className="size-4 text-ink-700/40" />
          </button>
        </div>

        <Button
          variant="outline"
          fullWidth
          className="mt-4"
          onClick={() => window.alert("Demo project — sign out is disabled.")}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>

        <p className="mt-5 text-center text-[11px] text-ink-700/40">
          Groomly · Demo build v1.0
        </p>
      </div>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-ink-900/6 px-4 py-3.5 text-sm text-ink-800 transition last:border-0 hover:bg-cream-100"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-cream-200 text-ink-800">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-4 text-ink-700/40" />
    </Link>
  );
}
