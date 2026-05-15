import { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import FlashMessages from '@/Components/FlashMessages'
import CardForm from '@/Components/Boards/CardForm'
import TimelineSlider from '@/Components/Boards/TimelineSlider'
import BoardColumn from '@/Components/Boards/BoardColumn'
import RecentActivity from '@/Components/Boards/RecentActivity'

export default function Show({
  board,
  columns,
  activity_log,
  historical_view,
  selected_time,
  timeline,
}) {
  const [editingCardId, setEditingCardId] = useState(null)
  const [activeCard, setActiveCard] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  function findCard(cardId) {
    return columns
      .flatMap((column) => column.cards)
      .find((card) => card.id === Number(cardId))
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

    if (!over || historical_view) return

    const card = findCard(active.id)
    const sourceColumn = findColumnByCard(active.id)
    const targetColumn =
      findColumnByCard(over.id) || findColumnByDroppableId(over.id)

    if (!card || !sourceColumn || !targetColumn) return
    if (sourceColumn.key === targetColumn.key && active.id === over.id) return

    const targetCards = targetColumn.cards.filter(
      (targetCard) => targetCard.id !== card.id,
    )

    const overCardIndex = targetCards.findIndex(
      (targetCard) => targetCard.id === Number(over.id),
    )

    const insertIndex = overCardIndex >= 0 ? overCardIndex : targetCards.length

    router.patch(`/boards/${board.id}/cards/${card.id}/move`, {
      card: {
        target_status: targetColumn.key,
        previous_position: targetCards[insertIndex - 1]?.position || null,
        next_position: targetCards[insertIndex]?.position || null,
      },
    })
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <header className="mb-6">
        <p className="text-sm text-slate-500">Kanban Time Travel</p>
        <h1 className="text-3xl font-bold text-slate-900">{board.name}</h1>
      </header>

      <FlashMessages />

      {historical_view && (
        <div className="mb-4 rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-900">
          Viewing historical board state from {selected_time}. Editing is disabled.
        </div>
      )}

      {!historical_view && (
        <CardForm boardId={board.id} columns={columns} />
      )}

      <TimelineSlider
        boardId={board.id}
        timeline={timeline}
        selectedTime={selected_time}
        historicalView={historical_view}
      />

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
          {activeCard && (
            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
              <h3 className="font-medium text-slate-900">{activeCard.title}</h3>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <RecentActivity activityLog={activity_log} />
    </main>
  )
}