export default function Show({ board, columns }) {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <header className="mb-6">
        <p className="text-sm text-slate-500">Kanban Time Travel</p>
        <h1 className="text-3xl font-bold text-slate-900">{board.name}</h1>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {columns.map((column) => (
          <div
            key={column.key}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="mb-4 font-semibold text-slate-800">
              {column.title}
            </h2>

            <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-400">
              No cards yet
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
