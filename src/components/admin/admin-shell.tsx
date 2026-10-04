"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  Megaphone,
  Menu,
  Scissors,
  Settings as SettingsIcon,
  Star,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { Logo, ScissorsMark } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/stylists", label: "Stylists", icon: UserCog },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-ink-950">
      <div className="px-5 py-5">
        <Logo light />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-cream-50/10 text-cream-50"
                  : "text-cream-200/55 hover:bg-cream-50/5 hover:text-cream-100",
              )}
            >
              <Icon
                className={cn("size-[18px]", active && "text-gold-400")}
                strokeWidth={active ? 2.4 : 2}
              />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl bg-cream-50/5 p-3.5">
        <p className="text-xs font-semibold text-cream-50">Groomly Pro</p>
        <p className="mt-1 text-[11px] leading-relaxed text-cream-200/50">
          Demo workspace. All data is stored locally in your browser.
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex h-8 items-center rounded-lg bg-gold-500 px-3 text-[11px] font-semibold text-ink-950"
        >
          Open customer app
        </Link>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f5f6]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-64">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-12 top-4 grid size-9 place-items-center rounded-full bg-white text-ink-900 shadow-lg"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-[#f5f5f6]/85 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="grid size-9 place-items-center rounded-xl bg-white text-ink-900 ring-1 ring-black/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <span className="lg:hidden">
              <ScissorsMark />
            </span>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-ink-900">
                {NAV.find((n) =>
                  n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href),
                )?.label ?? "Dashboard"}
              </p>
              <p className="text-[11px] text-ink-700/50">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="relative grid size-9 place-items-center rounded-xl bg-white text-ink-800 ring-1 ring-black/5">
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-white py-1.5 pl-1.5 pr-3 ring-1 ring-black/5">
              <span className="grid size-7 place-items-center rounded-lg bg-ink-900 text-[11px] font-semibold text-gold-400">
                SO
              </span>
              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold leading-tight text-ink-900">
                  Salon Owner
                </p>
                <p className="text-[10px] leading-tight text-ink-700/50">
                  admin@salon.com
                </p>
              </div>
              <ChevronDown className="size-4 text-ink-700/40" />
            </div>
          </div>
        </header>

        <main className="px-4 py-5 lg:px-8 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
