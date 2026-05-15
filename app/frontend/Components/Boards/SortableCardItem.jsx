import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import CardItem from './CardItem'

export default function SortableCardItem(props) {
  const { card, readOnly } = props

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
    disabled: readOnly,
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
    >
      <CardItem
        {...props}
        dragHandleProps={
          readOnly
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