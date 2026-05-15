import { useEffect, useState } from 'react'
import { useForm, router } from '@inertiajs/react'

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function Show({ board, columns, activity_log, flash, historical_view, selected_time, timeline, }) {
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
  const [activeCard, setActiveCard] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )
  function findCard(cardId) {
    return columns.flatMap((column) => column.cards).find((card) => card.id === Number(cardId))
  }

  function findColumnByCard(cardId) {
    return columns.find((column) =>
      column.cards.some((card) => card.id === Number(cardId)),
    )
  }

  function findColumnByDroppableId(id) {
    return columns.find((column) => column.key === id)
  }

  function handleDragStart(event) {
    setActiveCard(findCard(event.active.id))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const card = findCard(active.id)
    const sourceColumn = findColumnByCard(active.id)
    const targetColumn =
      findColumnByCard(over.id) || findColumnByDroppableId(over.id)

    if (!card || !sourceColumn || !targetColumn) return

    const targetCards = targetColumn.cards.filter(
      (targetCard) => targetCard.id !== card.id,
    )

    const overCardIndex = targetCards.findIndex(
      (targetCard) => targetCard.id === Number(over.id),
    )

    const insertIndex = overCardIndex >= 0 ? overCardIndex : targetCards.length

    const previousCard = targetCards[insertIndex - 1]
    const nextCard = targetCards[insertIndex]

    router.patch(`/boards/${board.id}/cards/${card.id}/move`, {
      card: {
        target_status: targetColumn.key,
        previous_position: previousCard?.position || null,
        next_position: nextCard?.position || null,
      },
    })
  }
  const timelineEnd = timeline.end_time ? new Date(timeline.end_time).getTime() : null

  const timelineStart = timeline.start_time
  ? new Date(timeline.start_time).getTime()
  : null

  const selectedTimelineValue = selected_time
    ? new Date(selected_time).getTime()
    : timelineEnd

  const [timelineValue, setTimelineValue] = useState(
    selectedTimelineValue || timelineEnd,
  )

  useEffect(() => {
    setTimelineValue(selectedTimelineValue || timelineEnd)
  }, [selectedTimelineValue, timelineEnd])

  function handleTimelineInput(event) {
    setTimelineValue(Number(event.target.value))
  }

  function applyTimelineState() {
    const timestamp = new Date(Number(timelineValue)).toISOString()

    router.get(
      `/boards/${board.id}`,
      { at: timestamp },
      {
        preserveScroll: true,
        preserveState: false,
      },
    )
  }

  function returnToLiveView() {
    router.get(
      `/boards/${board.id}`,
      {},
      {
        preserveScroll: true,
        preserveState: false,
      },
    )
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
      {historical_view && (
        <div className="mb-4 rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-900">
          Viewing historical board state from {selected_time}. Editing is disabled.
        </div>
      )}
      {!historical_view && (
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
      )}
      {timelineStart && timelineEnd && (
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-800">Timeline</h2>
              <p className="text-sm text-slate-500">
                Scrub to view the board at a previous moment.
              </p>
            </div>

            {historical_view && (
              <button
                type="button"
                onClick={returnToLiveView}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Return to live
              </button>
            )}
          </div>

          <input
            type="range"
            min={timelineStart}
            max={timelineEnd}
            value={timelineValue || timelineEnd}
            onChange={handleTimelineInput}
            onMouseUp={applyTimelineState}
            onTouchEnd={applyTimelineState}
            className="w-full"
          />

          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span style={{'margin-right': 4}}>{new Date(timelineStart).toLocaleString()}</span>
            <span>{new Date(timelineEnd).toLocaleString()}</span>
          </div>
        </section>
      )}
      <DndContext
        sensors={historical_view ? [] : sensors}
        onDragStart={historical_view ? undefined : handleDragStart}
        onDragEnd={historical_view ? undefined : handleDragEnd}
        >
        <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {columns.map((column) => (
            <BoardColumn
              key={column.key}
              boardId={board.id}
              column={column}
              editingCardId={editingCardId}
              setEditingCardId={setEditingCardId}
              readOnly={historical_view}
            />
          ))}
        </section>
        <DragOverlay>
          {activeCard ? (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
              <h3 className="font-medium text-slate-900">{activeCard.title}</h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <RecentActivity activity_log={activity_log} />
    </main>
  )
  function CardItem({ boardId, card, editingCardId, setEditingCardId, readOnly, dragHandleProps, }) {
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
      <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
        <h3 className="font-medium text-slate-900">{card.title}</h3>

        {card.description && (
          <p className="mt-1 text-sm text-slate-600">{card.description}</p>
        )}
        {!readOnly && (
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
        )}
      </article>
    )
  }
  function BoardColumn({ boardId, column, editingCardId, setEditingCardId, readOnly, }) {
    const { setNodeRef } = useDroppable({
      id: column.key,
    })

    return (
      <div
        ref={setNodeRef}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h2 className="mb-4 font-semibold text-slate-800">{column.title}</h2>

        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {column.cards.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-400">
                No cards yet
              </div>
            ) : (
              column.cards.map((card) => (
                <SortableCardItem
                  key={card.id}
                  boardId={boardId}
                  card={card}
                  editingCardId={editingCardId}
                  setEditingCardId={setEditingCardId}
                  readOnly={readOnly}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    )
  }
  function SortableCardItem(props) {
    const { card } = props

    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: card.id,
      disabled: props.readOnly,
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={isDragging ? 'opacity-40' : ''}
        {...attributes}
        {...listeners}
      >
        <CardItem
  {...props}
  dragHandleProps={
    props.readOnly
      ? null
      : {
          ref: setActivatorNodeRef,
          attributes,
          listeners,
        }
  }
/>
      </div>
    )
  }

  function RecentActivity({ activity_log = [] }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <aside className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm" style={{ marginTop: "32px" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-5 py-4 text-left p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🕘</span>

            <h2 className="text-base font-semibold text-slate-800">
              Recent Activity
            </h2>
          </div>

          <span className="rounded-md bg-slate-100 px-3 py-1 text-lg font-medium text-slate-600 transition hover:bg-slate-200">
            {isOpen ? "−" : "+"}
          </span>
        </button>

        {isOpen && (
          <div className="border-t border-slate-100 p-4">
            <div
              style={{
                height: "180px",
                overflowY: "auto",
              }}
            >
              {activity_log.length === 0 ? (
                <p className="text-sm text-slate-400">No activity yet</p>
              ) : (
                <ul className="space-y-3 pr-2">
                  {activity_log.map((event) => (
                    <li
                      key={event.id}
                      className="border-b border-slate-100 pb-2 last:border-0"
                    >
                      <p className="text-sm text-slate-700">
                        {event.message}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {event.created_at}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </aside>
    )
  }
}
