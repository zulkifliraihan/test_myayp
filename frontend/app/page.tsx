import EmployeesView from "../components/employees-view";

export default async function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Frontend App</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Manage employees and update their profile status.
            </p>
          </div>
        </header>

        <section aria-label="Employees Table" className="rounded-xl border border-zinc-200 bg-white shadow-sm p-3 sm:p-4">
          <EmployeesView />
        </section>
      </div>
    </main>
  );
}
