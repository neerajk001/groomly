"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@salon.com");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/admin"), 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_10%,#2a2621,transparent_55%),radial-gradient(circle_at_80%_90%,#33291a,transparent_50%),#0d0c0b] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <Logo light />
        </div>

        <div className="rounded-3xl bg-cream-50 p-6 shadow-2xl">
          <h1 className="text-xl font-semibold tracking-tight text-ink-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-ink-700/60">
            Access your salon dashboard
          </p>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-700">
                Email
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-ink-900/12 bg-white px-3 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-400/25">
                <Mail className="size-4 text-ink-700/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-2.5 text-sm outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-700">
                Password
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-ink-900/12 bg-white px-3 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-400/25">
                <Lock className="size-4 text-ink-700/40" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-2.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="text-ink-700/40"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="flex items-center gap-2 text-xs text-ink-700"
              >
                <span
                  className={`grid size-4 place-items-center rounded border ${
                    remember
                      ? "border-gold-500 bg-gold-500 text-white"
                      : "border-ink-900/25"
                  }`}
                >
                  {remember && "✓"}
                </span>
                Remember me
              </button>
              <button type="button" className="text-xs font-medium text-gold-600">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-2xl bg-ink-900 text-[15px] font-semibold text-cream-50 transition hover:bg-ink-800 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-ink-700/40">
            Demo credentials are pre-filled — just press Login.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-cream-200/50">
          <Link href="/" className="hover:text-cream-100">
            ← Back to customer app
          </Link>
        </p>
      </div>
    </div>
  );
}
