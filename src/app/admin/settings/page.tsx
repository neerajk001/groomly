"use client";

import { useState } from "react";
import { Building2, Check, Percent, Sliders, Wallet } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/stat-card";
import { Button, Field, Input, Toggle } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { updateSettings } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = ["General", "Business", "Notifications", "Payments", "Booking Rules"] as const;

export default function SettingsPage() {
  const db = useDB();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Business");
  const [form, setForm] = useState(db.settings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage your salon profile, rules and preferences."
        action={
          <Button onClick={save}>
            {saved ? <Check className="size-4" /> : null}
            {saved ? "Saved" : "Save Changes"}
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-black/5 bg-white p-1.5 lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition lg:w-full",
                tab === t
                  ? "bg-ink-900 text-cream-50"
                  : "text-ink-700/60 hover:bg-cream-100",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5">
          {tab === "Business" && (
            <div className="max-w-lg space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-cream-100 text-ink-800">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">
                    Business Profile
                  </h2>
                  <p className="text-[11px] text-ink-700/50">
                    Shown to customers across the app
                  </p>
                </div>
              </div>
              <Field label="Salon name">
                <Input
                  value={form.salonName}
                  onChange={(e) =>
                    setForm({ ...form, salonName: e.target.value })
                  }
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email">
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Address">
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Opening time">
                  <Input
                    value={form.openTime}
                    onChange={(e) =>
                      setForm({ ...form, openTime: e.target.value })
                    }
                  />
                </Field>
                <Field label="Closing time">
                  <Input
                    value={form.closeTime}
                    onChange={(e) =>
                      setForm({ ...form, closeTime: e.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          )}

          {tab === "Booking Rules" && (
            <div className="max-w-lg space-y-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-cream-100 text-ink-800">
                  <Sliders className="size-5" />
                </span>
                <h2 className="text-sm font-semibold text-ink-900">
                  Booking Rules
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Slot duration (mins)">
                  <Input
                    type="number"
                    value={form.bookingRules.slotDuration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bookingRules: {
                          ...form.bookingRules,
                          slotDuration: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Advance booking (days)">
                  <Input
                    type="number"
                    value={form.bookingRules.advanceDays}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bookingRules: {
                          ...form.bookingRules,
                          advanceDays: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Field>
              </div>
              <div className="rounded-xl bg-cream-100 p-4">
                <Toggle
                  checked={form.bookingRules.allowCancellation}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      bookingRules: {
                        ...form.bookingRules,
                        allowCancellation: v,
                      },
                    })
                  }
                  label="Allow customers to cancel bookings"
                />
              </div>
            </div>
          )}

          {tab === "Notifications" && (
            <div className="max-w-lg space-y-4">
              <h2 className="text-sm font-semibold text-ink-900">
                Notifications
              </h2>
              {(
                [
                  ["email", "Email notifications"],
                  ["sms", "SMS notifications"],
                  ["push", "Push notifications"],
                ] as const
              ).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl bg-cream-100 p-4"
                >
                  <span className="text-sm text-ink-800">{label}</span>
                  <Toggle
                    checked={form.notifications[key]}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        notifications: { ...form.notifications, [key]: v },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "Payments" && (
            <div className="max-w-lg space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-cream-100 text-ink-800">
                  <Wallet className="size-5" />
                </span>
                <h2 className="text-sm font-semibold text-ink-900">
                  Payment Methods
                </h2>
              </div>
              {["UPI (GPay, PhonePe, Paytm)", "Credit / Debit Card", "Pay at Salon"].map(
                (method) => (
                  <div
                    key={method}
                    className="flex items-center justify-between rounded-xl bg-cream-100 p-4"
                  >
                    <span className="text-sm text-ink-800">{method}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                      Enabled
                    </span>
                  </div>
                ),
              )}
              <p className="flex items-center gap-1.5 text-[11px] text-ink-700/50">
                <Percent className="size-3" />
                Platform fee of ₹20 applies to every online booking.
              </p>
            </div>
          )}

          {tab === "General" && (
            <div className="max-w-lg space-y-4">
              <h2 className="text-sm font-semibold text-ink-900">
                General Settings
              </h2>
              <Field label="Currency">
                <Input
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                />
              </Field>
              <Field label="Timezone" hint="Used for appointment scheduling">
                <Input value="Asia/Kolkata (GMT +5:30)" readOnly />
              </Field>
              <Field label="Language">
                <Input value="English (India)" readOnly />
              </Field>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
