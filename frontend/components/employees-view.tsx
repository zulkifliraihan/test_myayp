"use client";

import { useEffect, useMemo, useState } from "react";
import EmployeeTable, { type Employee } from "./employee-table";

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: Array<{
    url: string | null;
    label: string;
    page?: number | null;
    active: boolean;
  }>;
};

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function EmployeesView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (p: number, pp: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/employees?page=${p}&per_page=${pp}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch employees");
      const list = (json?.data?.employees ?? []) as Employee[];
      const m = json?.data?.meta as Meta | undefined;
      setEmployees(list);
      if (m) setMeta(m);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, perPage);
  }, [page, perPage]);

  const canPrev = (meta?.current_page ?? 1) > 1;
  const canNext = (meta?.current_page ?? 1) < (meta?.last_page ?? 1);

  const numberLinks = useMemo(() => {
    const links = meta?.links ?? [];
    const result: Array<
      | { type: "page"; page: number; active: boolean }
      | { type: "ellipsis"; key: string }
    > = [];
    const getPageFromUrl = (u: string | null | undefined): number | null => {
      if (!u) return null;
      try {
        const url = new URL(u);
        const p = url.searchParams.get("page");
        return p ? Number(p) : null;
      } catch {
        return null;
      }
    };
    for (const l of links) {
      const label = l.label.replace(/&laquo;|&raquo;/g, "").trim();
      if (label.toLowerCase().includes("previous") || label.toLowerCase().includes("next")) {
        continue;
      }
      if (label === "..." || l.url === null) {
        result.push({ type: "ellipsis", key: `${label}-${Math.random().toString(36).slice(2)}` });
        continue;
      }
      const pageByField = typeof l.page === "number" ? l.page : null;
      const pageByUrl = getPageFromUrl(l.url);
      const pageByLabel = /^\d+$/.test(label) ? Number(label) : null;
      const page = pageByField ?? pageByUrl ?? pageByLabel;
      if (typeof page === "number") {
        result.push({ type: "page", page, active: !!l.active });
      }
    }
    return result;
  }, [meta]);

  return (
    <div className="w-full">
      <div className="min-h-60">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-zinc-500">Loading...</div>
        ) : error ? (
          <div className="flex h-40 items-center justify-center text-sm text-red-600">{error}</div>
        ) : (
          <EmployeeTable initialEmployees={employees} />
        )}
      </div>

      {/* Footer controls: per page + numbered pagination (mobile-friendly) */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="perPageBottom" className="text-sm text-zinc-600">
            Per page
          </label>
          <select
            id="perPageBottom"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus:border-zinc-400 focus:outline-none"
          >
            {PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <p className="ml-2 hidden text-xs text-zinc-500 sm:block">
            Showing {employees.length} of {meta?.total ?? employees.length}
          </p>
        </div>

        <div className="-mx-1 overflow-x-auto">
          <div className="inline-flex items-center gap-1 px-1">
            <button
              className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              onClick={() => canPrev && setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
            >
              Prev
            </button>
            {numberLinks.map((it, idx) =>
              it.type === "ellipsis" ? (
                <span key={`f-el-${idx}-${it.key}`} className="px-2 text-sm text-zinc-500">
                  …
                </span>
              ) : (
                <button
                  key={`f-pg-${idx}-${it.page}`}
                  onClick={() => setPage(it.page)}
                  disabled={it.active}
                  className={
                    "shrink-0 min-w-9 rounded-md px-2.5 py-1.5 text-sm " +
                    (it.active
                      ? "bg-zinc-900 font-semibold text-white"
                      : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50")
                  }
                >
                  {it.page}
                </button>
              )
            )}
            <button
              className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              onClick={() => canNext && setPage((p) => p + 1)}
              disabled={!canNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
