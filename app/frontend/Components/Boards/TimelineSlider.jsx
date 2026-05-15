import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'

export default function TimelineSlider({
  boardId,
  timeline,
  selectedTime,
  historicalView,
}) {
  const timelineStart = timeline.start_time
    ? new Date(timeline.start_time).getTime()
    : null

  const timelineEnd = timeline.end_time
    ? new Date(timeline.end_time).getTime()
    : null

  const selectedTimelineValue = selectedTime
    ? new Date(selectedTime).getTime()
    : timelineEnd

  const [timelineValue, setTimelineValue] = useState(
    selectedTimelineValue || timelineEnd,
  )

  useEffect(() => {
    setTimelineValue(selectedTimelineValue || timelineEnd)
  }, [selectedTimelineValue, timelineEnd])

  if (!timelineStart || !timelineEnd) return null

  function handleTimelineInput(event) {
    setTimelineValue(Number(event.target.value))
  }

  function applyTimelineState() {
    const timestamp = new Date(Number(timelineValue)).toISOString()

    router.get(
      `/boards/${boardId}`,
      { at: timestamp },
      {
        preserveScroll: true,
        preserveState: false,
      },
    )
  }

  function returnToLiveView() {
    router.get(
      `/boards/${boardId}`,
      {},
      {
        preserveScroll: true,
        preserveState: false,
      },
    )
  }

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-800">Timeline</h2>
          <p className="text-sm text-slate-500">
            Scrub to view the board at a previous moment.
          </p>
        </div>

        {historicalView && (
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

      <div className="mt-2 flex justify-between gap-4 text-xs text-slate-500">
        <span>{new Date(timelineStart).toLocaleString()}</span>
        <span>{new Date(timelineEnd).toLocaleString()}</span>
      </div>
    </section>
  )
}