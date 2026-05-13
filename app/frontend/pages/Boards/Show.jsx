import { useForm } from '@inertiajs/react'
export default function Show({ board, columns, flash }) {
  const { data, setData, post, processing, reset } = useForm({
    title: '',
    description: '',
    status: 'backlog',
  })

  function handleSubmit(event) {
    event.preventDefault()

    post(`/boards/${board.id}/cards`, {
      onSuccess: () => reset(),
    })
}
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <header className="mb-6">
        <p className="text-sm text-slate-500">Kanban Time Travel</p>
        <h1 className="text-3xl font-bold text-slate-900">{board.name}</h1>
      </header>
      {flash?.notice && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">
          {flash.notice}
        </div>
      )}

      {flash?.alert && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
          {flash.alert}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              value={data.title}
              onChange={(event) => setData('title', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="title"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <input
              value={data.description}
              onChange={(event) => setData('description', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Optional details"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Column
            </label>
            <select
              value={data.status}
              onChange={(event) => setData('status', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {columns.map((column) => (
                <option key={column.key} value={column.key}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {processing ? 'Creating...' : 'Create Card'}
            </button>
          </div>
        </div>
      </form>
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
