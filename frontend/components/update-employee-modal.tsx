"use client";

import { useEffect, useMemo, useState } from "react";
import type { Employee } from "./employee-table";

type Props = {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSaved: (employee: Employee) => void;
};

export default function UpdateEmployeeModal({ open, employee, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && employee) {
      setName(employee.name);
      setEmail(employee.email);
      setIsActive(employee.isActive);
      setError(null);
    }
  }, [open, employee]);

  const visible = open && !!employee;

  const save = async () => {
    if (!employee) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, is_active: isActive }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to update employee");
      }
      const data = json?.data as { id: number; name: string; email: string; isActive: boolean };
      onSaved({ id: data.id, name: data.name, email: data.email, isActive: data.isActive });
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 m-4 w-full max-w-lg rounded-xl bg-white p-5 shadow-lg sm:m-0">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">User Profile</h2>
          <p className="mt-0.5 text-sm text-zinc-500">Update employee details</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              placeholder="john@example.com"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700">Status</span>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((v) => !v)}
              className={
                "relative inline-flex h-6 w-11 items-center rounded-full transition " +
                (isActive ? "bg-green-600" : "bg-zinc-300")
              }
            >
              <span
                className={
                  "inline-block h-5 w-5 transform rounded-full bg-white transition " +
                  (isActive ? "translate-x-5" : "translate-x-1")
                }
              />
            </button>
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

