"use client";

import { useMemo, useState } from "react";
import { Mail, MoreVertical, Phone, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/stat-card";
import { Avatar, Badge, Button, Field, Input, Modal, Select } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { deleteCustomer, upsertCustomer } from "@/lib/store";
import type { Customer } from "@/lib/types";
import { uid } from "@/lib/utils";

const CATEGORIES: Customer["category"][] = ["New", "Regular", "VIP"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  category: "New" as Customer["category"],
};

export default function CustomersPage() {
  const db = useDB();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.customers.filter((c) =>
      q
        ? c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
        : true,
    );
  }, [db.customers, query]);

  const save = () => {
    if (!form.name.trim()) return;
    upsertCustomer({
      id: uid("cus"),
      name: form.name,
      email: form.email || "—",
      phone: form.phone || "—",
      avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(form.name)}`,
      category: form.category,
      visits: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
    });
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description={`${db.customers.length} customers in your salon database.`}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add Customer
          </Button>
        }
      />

      <div className="rounded-2xl border border-black/5 bg-white">
        <div className="border-b border-black/5 p-3.5">
          <div className="flex items-center gap-2 rounded-xl bg-cream-100 px-3 lg:max-w-xs">
            <Search className="size-4 text-ink-700/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink-700/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-[11px] uppercase tracking-wider text-ink-700/45">
                <th className="px-4 py-2.5 font-medium lg:px-5">Name</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium">Visits</th>
                <th className="px-4 py-2.5 text-right font-medium lg:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-black/5 last:border-0 hover:bg-cream-50/60"
                >
                  <td className="px-4 py-3 lg:px-5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={customer.avatar}
                        alt={customer.name}
                        size={36}
                      />
                      <div>
                        <p className="text-[13px] font-medium text-ink-900">
                          {customer.name}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-ink-700/50">
                          <Mail className="size-3" />
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        customer.category === "VIP"
                          ? "gold"
                          : customer.category === "Regular"
                            ? "blue"
                            : "neutral"
                      }
                    >
                      {customer.category}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-ink-700">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3 text-ink-700/40" />
                      {customer.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-700">
                    {customer.visits}
                  </td>
                  <td className="px-4 py-3 text-right lg:px-5">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${customer.name}?`)) {
                            deleteCustomer(customer.id);
                          }
                        }}
                        className="grid size-8 place-items-center rounded-lg text-ink-700/50 hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <button className="grid size-8 place-items-center rounded-lg text-ink-700/50 hover:bg-cream-100">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-ink-700/50"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Customer"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>
              <UserPlus className="size-4" />
              Add
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Field label="Full name">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Arjun Kapoor"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@email.com"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 ..."
            />
          </Field>
          <Field label="Category">
            <Select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as Customer["category"],
                })
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
