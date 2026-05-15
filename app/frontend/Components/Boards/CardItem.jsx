import { useForm } from '@inertiajs/react'

export default function CardItem({
  boardId,
  card,
  editingCardId,
  setEditingCardId,
  readOnly,
  dragHandleProps,
}) {
  const isEditing = editingCardId === card.id

  const { data, setData, patch, delete: destroy, processing } = useForm({
    title: card.title,
    description: card.description || '',
  })

  function handleUpdate(event) {
    event.preventDefault()

    if (readOnly) return

    patch(`/boards/${boardId}/cards/${card.id}`, {
      onSuccess: () => setEditingCardId(null),
    })
  }

  function handleDelete() {
    if (readOnly) return
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

          {!readOnly && (
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
          )}
        </form>
      </article>
    )
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900">{card.title}</h3>

        {!readOnly && (
          <button
            type="button"
            ref={dragHandleProps?.ref}
            {...dragHandleProps?.attributes}
            {...dragHandleProps?.listeners}
            className="cursor-grab text-slate-400 hover:text-slate-700 active:cursor-grabbing"
            aria-label="Drag card"
          >
            ⋮⋮
          </button>
        )}
      </div>

      {card.description && (
        <p className="mt-1 text-sm text-slate-600">{card.description}</p>
      )}

      {!readOnly && (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingCardId(card.id)}
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={processing}
            className="text-xs text-slate-500 hover:text-slate-900 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  )
}