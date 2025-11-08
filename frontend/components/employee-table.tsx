"use client";

import { useEffect, useMemo, useState } from "react";
import UpdateEmployeeModal from "./update-employee-modal";

export type Employee = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};

export default function EmployeeTable({
  initialEmployees,
}: {
  initialEmployees: Employee[];
}) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [open, setOpen] = useState(false);

  const onOpen = (emp: Employee) => {
    setSelected(emp);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const onSaved = (updated: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    onClose();
  };

  const rows = useMemo(() => employees, [employees]);

  useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-auto text-left text-xs sm:text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3 min-w-40">Name</th>
              <th className="px-4 py-3 min-w-[220px]">Email</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((emp) => (
              <tr key={emp.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-zinc-900">{emp.id}</td>
                <td className="px-4 py-3">{emp.name}</td>
                <td className="px-4 py-3 text-zinc-700">
                  <span className="truncate sm:whitespace-normal sm:wrap-break-word block max-w-60 sm:max-w-none">
                    {emp.email}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      emp.isActive
                        ? "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                        : "inline-flex items-center rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700"
                    }
                  >
                    {emp.isActive ? "ACTIVE" : "DEACTIVATED"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onOpen(emp)}
                    className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 sm:px-3"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateEmployeeModal
        open={open}
        employee={selected}
        onClose={onClose}
        onSaved={onSaved}
      />
    </div>
  );
}
