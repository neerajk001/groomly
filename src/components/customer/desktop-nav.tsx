"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Avatar, Logo } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our Services" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/profile", label: "Profile" },
];

export function DesktopNav() {
  const pathname = usePathname();
  const db = useDB();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-ink-900/8 bg-cream-50/85 backdrop-blur lg:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-10">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-ink-900 text-cream-50"
                      : "text-ink-700/70 hover:bg-ink-900/5 hover:text-ink-900",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-900/12 bg-white px-3.5 text-sm font-medium text-ink-800 transition hover:bg-cream-100"
          >
            <LayoutDashboard className="size-4 text-gold-500" />
            Salon Admin
          </Link>
          <Link href="/profile" className="flex items-center gap-2">
            <Avatar src={db.user.avatar} alt={db.user.name} size={36} />
          </Link>
        </div>
      </div>
    </header>
  );
}
