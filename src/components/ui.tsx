"use client";

import { Star } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Logo --------------------------------- */

export function Logo({
  className,
  light = false,
  showText = true,
}: {
  className?: string;
  light?: boolean;
  showText?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ScissorsMark light={light} />
      {showText && (
        <div className="leading-none">
          <p
            className={cn(
              "brand-serif text-[15px] font-semibold",
              light ? "text-cream-50" : "text-ink-900",
            )}
          >
            GROOMLY
          </p>
          <p
            className={cn(
              "mt-1 text-[7px] font-medium tracking-[0.34em]",
              light ? "text-cream-300/80" : "text-ink-700/50",
            )}
          >
            LOOK GOOD EVERYDAY
          </p>
        </div>
      )}
    </div>
  );
}

export function ScissorsMark({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-xl",
        light ? "bg-cream-50/10 ring-1 ring-cream-50/25" : "bg-ink-900",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <g
          stroke={light ? "#faf6ef" : "#d3af68"}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6.5" cy="16.5" r="2.6" />
          <circle cx="6.5" cy="7.5" r="2.6" />
          <path d="M8.7 9.1 20 16.5" />
          <path d="M8.7 14.9 20 7.5" />
        </g>
      </svg>
    </span>
  );
}

/* --------------------------------- Button -------------------------------- */

type Variant =
  | "primary"
  | "gold"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "soft";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-cream-50 hover:bg-ink-800 active:bg-ink-950 shadow-sm",
  gold: "bg-gold-500 text-ink-950 hover:bg-gold-400 shadow-sm",
  outline:
    "border border-ink-900/15 bg-white text-ink-900 hover:bg-cream-100",
  ghost: "text-ink-800 hover:bg-ink-900/5",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  success: "bg-moss-500 text-white hover:bg-moss-600",
  soft: "bg-cream-200 text-ink-800 hover:bg-cream-300",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-2xl",
  icon: "size-9 rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------------------------- Card --------------------------------- */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-900/8 bg-white shadow-[0_1px_2px_rgba(16,14,12,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* --------------------------------- Badge --------------------------------- */

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "gold" | "green" | "red" | "blue" | "amber";
}) {
  const tones = {
    neutral: "bg-cream-200 text-ink-700",
    gold: "bg-gold-200/70 text-gold-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-emerald-50 text-emerald-600",
    Confirmed: "bg-blue-50 text-blue-600",
    "In Progress": "bg-amber-50 text-amber-600",
    Pending: "bg-orange-50 text-orange-600",
    Cancelled: "bg-red-50 text-red-600",
    Active: "bg-emerald-50 text-emerald-600",
    Inactive: "bg-red-50 text-red-500",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        map[status] ?? "bg-cream-200 text-ink-700",
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

/* --------------------------------- Inputs -------------------------------- */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-700">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-700/60">{hint}</span>}
    </label>
  );
}

const fieldClass =
  "w-full rounded-xl border border-ink-900/12 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/40 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/25";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, "appearance-none pr-9", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, "min-h-24 resize-y", className)} {...props} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
      aria-pressed={checked}
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-moss-500" : "bg-ink-900/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
      {label && <span className="text-sm text-ink-800">{label}</span>}
    </button>
  );
}

/* ------------------------------- Star rating ----------------------------- */

export function StarRating({
  value,
  size = 12,
  showValue = false,
  className,
}: {
  value: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              i < Math.round(value)
                ? "fill-gold-400 text-gold-400"
                : "fill-ink-900/10 text-ink-900/10",
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-[11px] font-medium text-ink-800">{value.toFixed(1)}</span>
      )}
    </span>
  );
}

/* --------------------------------- Avatar -------------------------------- */

export function Avatar({
  src,
  alt,
  size = 40,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}

/* ---------------------------------- Modal -------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="animate-fade-up relative z-10 w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-ink-700 hover:bg-cream-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto thin-scrollbar">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------- Empty state ----------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-900/12 bg-white/60 px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-cream-200 text-ink-700">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-ink-700/70">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
