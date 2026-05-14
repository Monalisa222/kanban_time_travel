import { useState } from 'react'
import { useForm } from '@inertiajs/react'

export default function Show({ board, columns, flash }) {
  const { data, setData, post, processing, reset } = useForm({
    title: '',
    description: '',
    status: 'backlog',
  })

  const [editingCardId, setEditingCardId] = useState(null)

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
        <div className="mb-4">
          <span className="inline-block rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">{flash.notice}</span>
        </div>
      )}

      {flash?.alert && (
        <div className="mb-4">
          <span className="inline-block rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">{flash.alert}</span>
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
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg hover:border-slate-300"
            >
            <h2 className="text-sm font-semibold text-slate-800">
              {column.title}
            </h2>
    
            <div className="space-y-3">
              {column.cards.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-400">
                  No cards yet
                </div>
              ) : (
                column.cards.map((card) => (
                  <CardItem
                  key={card.id}
                  boardId={board.id}
                  card={card}
                  editingCardId={editingCardId}
                  setEditingCardId={setEditingCardId}
                />
                ))
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
  function CardItem({ boardId, card, editingCardId, setEditingCardId }) {
    const isEditing = editingCardId === card.id

    const { data, setData, patch, delete: destroy, processing } = useForm({
      title: card.title,
      description: card.description || '',
    })

    function handleUpdate(event) {
      event.preventDefault()

      patch(`/boards/${boardId}/cards/${card.id}`, {
        onSuccess: () => setEditingCardId(null),
      })
    }

    function handleDelete() {
      if (!window.confirm('Delete this card?')) return

      destroy(`/boards/${boardId}/cards/${card.id}`)
    }

    if (isEditing) {
      return (
        <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <form onSubmit={handleUpdate} className="space-y-3">
            <input
              value={data.title}
              onChange={(event) => setData('title', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />

            <textarea
              value={data.description}
              onChange={(event) => setData('description', event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              rows="3"
            />

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => setEditingCardId(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </article>
      )
    }

    return (
      <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
        <h3 className="font-medium text-slate-900">{card.title}</h3>

        {card.description && (
          <p className="mt-1 text-sm text-slate-600">{card.description}</p>
        )}
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingCardId(card.id)}
            style={{ cursor: 'pointer' }}
            className="text-xs text-slate-500 hover:text-slate-900"
            >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={processing}
            style={{ cursor: 'pointer' }}
            className="text-xs text-slate-500 hover:text-slate-900"
            >
            Delete
          </button>
        </div>
      </article>
    )
  }
}
