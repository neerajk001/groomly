"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/stat-card";
import { Button, Field, Input, Modal, Select, StatusBadge } from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { deleteService, upsertService } from "@/lib/store";
import type { Service, ServiceStatus } from "@/lib/types";
import { formatMoney, uid } from "@/lib/utils";

const CATEGORIES = [
  "Haircut",
  "Beard",
  "Facial",
  "Coloring",
  "Spa",
  "Other",
];

const empty: Omit<Service, "id"> = {
  name: "",
  category: "Haircut",
  price: 399,
  duration: 30,
  description: "",
  image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=500&h=500&q=80",
  status: "Active",
};

export default function ServicesPage() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(empty);

  const startAdd = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const startEdit = (service: Service) => {
    setEditing(service);
    setForm(service);
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    upsertService({ ...form, id: editing?.id ?? uid("svc") });
    setOpen(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description={`${db.services.length} services on your menu.`}
        action={
          <Button onClick={startAdd}>
            <Plus className="size-4" />
            Add Service
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-[11px] uppercase tracking-wider text-ink-700/45">
                <th className="px-4 py-2.5 font-medium lg:px-5">Name</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Price</th>
                <th className="px-4 py-2.5 font-medium">Duration</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium lg:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {db.services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-black/5 last:border-0 hover:bg-cream-50/60"
                >
                  <td className="px-4 py-3 lg:px-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.image}
                        alt={service.name}
                        className="size-9 rounded-lg object-cover"
                      />
                      <span className="text-[13px] font-medium text-ink-900">
                        {service.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-700">
                    {service.category}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-ink-900">
                    {formatMoney(service.price)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-700">
                    {service.duration} mins
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-4 py-3 text-right lg:px-5">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => startEdit(service)}
                        className="grid size-8 place-items-center rounded-lg text-ink-700/50 hover:bg-cream-100"
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${service.name}?`)) {
                            deleteService(service.id);
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
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Service" : "Add Service"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add service"}</Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Field label="Service name">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Beard Sculpt"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ServiceStatus })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (₹)">
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Duration (mins)">
              <Input
                type="number"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
              />
            </Field>
          </div>
          <Field label="Description">
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short description shown to customers"
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
