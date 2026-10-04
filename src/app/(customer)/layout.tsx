"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Home, Scissors, User } from "lucide-react";
import { DesktopNav } from "@/components/customer/desktop-nav";
import { PwaRegister } from "@/components/pwa-register";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Scissors },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/profile", label: "Profile", icon: User },
];

const HIDE_MOBILE_NAV = ["/onboarding", "/booking", "/summary", "/confirmed"];
const HIDE_DESKTOP_NAV = ["/onboarding", "/confirmed"];

function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="shrink-0 border-t border-ink-900/8 bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[430px] items-center justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
                active ? "text-ink-900" : "text-ink-700/50",
              )}
            >
              <Icon
                className={cn("size-5", active && "text-gold-500")}
                strokeWidth={active ? 2.4 : 2}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBottomNav = !HIDE_MOBILE_NAV.some((p) => pathname.startsWith(p));
  const showDesktopNav = !HIDE_DESKTOP_NAV.some((p) =>
    pathname.startsWith(p),
  );

  const wrapperClass =
    pathname === "/onboarding"
      ? ""
      : pathname.startsWith("/confirmed")
        ? "lg:mx-auto lg:w-full lg:max-w-2xl lg:py-12"
        : "lg:mx-auto lg:w-full lg:max-w-7xl lg:px-8 lg:py-8";

  return (
    <div className="min-h-dvh w-full bg-cream-100">
      <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-cream-100 lg:h-auto lg:max-w-none lg:overflow-visible">
        <PwaRegister />
        {showDesktopNav && <DesktopNav />}
        <div className="flex-1 overflow-y-auto no-scrollbar lg:overflow-visible">
          <div className={wrapperClass}>{children}</div>
        </div>
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
