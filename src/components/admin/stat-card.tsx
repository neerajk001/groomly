import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "up",
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  tone?: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_1px_2px_rgba(16,14,12,0.03)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-700/60">{label}</p>
        {icon && (
          <span className="grid size-8 place-items-center rounded-xl bg-cream-100 text-ink-800">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-2xl font-semibold tracking-tight text-ink-900">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            "mt-1 text-[11px] font-medium",
            tone === "up"
              ? "text-emerald-600"
              : tone === "down"
                ? "text-red-500"
                : "text-ink-700/50",
          )}
        >
          {delta}
        </p>
      )}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-ink-700/60">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
