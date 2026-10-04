"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/stat-card";
import {
  Avatar,
  Button,
  Field,
  Input,
  Modal,
  Select,
  StarRating,
  StatusBadge,
} from "@/components/ui";
import { useDB } from "@/lib/hooks";
import { deleteStylist, upsertStylist } from "@/lib/store";
import type { ServiceStatus, Stylist } from "@/lib/types";
import { uid } from "@/lib/utils";

const ROLES = ["Hair Stylist", "Senior Stylist", "Beautician", "Spa Therapist"];

const empty: Omit<Stylist, "id"> = {
  name: "",
  role: "Hair Stylist",
  rating: 4.5,
  bookings: 0,
  avatar: "https://i.pravatar.cc/200?img=68",
  status: "Active",
  specialties: [],
};

export default function StylistsPage() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Stylist | null>(null);
  const [form, setForm] = useState(empty);

  const startAdd = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const startEdit = (stylist: Stylist) => {
    setEditing(stylist);
    setForm(stylist);
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    upsertStylist({ ...form, id: editing?.id ?? uid("sty") });
    setOpen(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Stylists"
        description={`${db.stylists.length} team members.`}
        action={
          <Button onClick={startAdd}>
            <Plus className="size-4" />
            Add Stylist
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-[11px] uppercase tracking-wider text-ink-700/45">
                <th className="px-4 py-2.5 font-medium lg:px-5">Name</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Rating</th>
                <th className="px-4 py-2.5 font-medium">Total Bookings</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium lg:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {db.stylists.map((stylist) => (
                <tr
                  key={stylist.id}
                  className="border-b border-black/5 last:border-0 hover:bg-cream-50/60"
                >
                  <td className="px-4 py-3 lg:px-5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={stylist.avatar}
                        alt={stylist.name}
                        size={36}
                      />
                      <span className="text-[13px] font-medium text-ink-900">
                        {stylist.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-700">
                    {stylist.role}
                  </td>
                  <td className="px-4 py-3">
                    <StarRating value={stylist.rating} showValue />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ink-700">
                    {stylist.bookings}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={stylist.status} />
                  </td>
                  <td className="px-4 py-3 text-right lg:px-5">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => startEdit(stylist)}
                        className="grid size-8 place-items-center rounded-lg text-ink-700/50 hover:bg-cream-100"
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${stylist.name}?`)) {
                            deleteStylist(stylist.id);
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
        title={editing ? "Edit Stylist" : "Add Stylist"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add stylist"}</Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Field label="Full name">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Rahul Verma"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role">
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
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
            <Field label="Rating">
              <Input
                type="number"
                step="0.1"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Total bookings">
              <Input
                type="number"
                value={form.bookings}
                onChange={(e) =>
                  setForm({ ...form, bookings: Number(e.target.value) })
                }
              />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
