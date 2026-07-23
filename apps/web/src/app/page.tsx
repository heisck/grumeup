export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-container">
      <h1 className="text-4xl font-bold tracking-tight text-primary-600 sm:text-6xl">GrumeUp</h1>
      <p className="max-w-lg text-center text-lg text-surface-600">
        Production-quality foundation. Phase 1 scaffolding complete.
      </p>
      <div className="flex gap-3">
        <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
          Next.js 16
        </span>
        <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
          TypeScript Strict
        </span>
        <span className="inline-flex items-center rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
          Turborepo
        </span>
      </div>
    </main>
  );
}
