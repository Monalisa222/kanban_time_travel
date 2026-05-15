import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import SortableCardItem from './SortableCardItem'

export default function BoardColumn({
  boardId,
  column,
  editingCardId,
  setEditingCardId,
  readOnly,
}) {
  const { setNodeRef } = useDroppable({
    id: column.key,
  })

  return (
    <div
      ref={setNodeRef}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-800">{column.title}</h2>

        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {column.cards.length}
        </span>
      </div>

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