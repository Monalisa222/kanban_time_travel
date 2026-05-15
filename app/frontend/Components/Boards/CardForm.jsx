import { useForm } from '@inertiajs/react'

export default function CardForm({ boardId, columns }) {
  const { data, setData, post, processing, reset } = useForm({
    title: '',
    description: '',
    status: 'backlog',
  })

  function handleSubmit(event) {
    event.preventDefault()

    post(`/boards/${boardId}/cards`, {
      onSuccess: () => reset(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
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
  )
}