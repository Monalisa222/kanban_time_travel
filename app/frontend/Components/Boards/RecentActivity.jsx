import { useState } from 'react'

export default function RecentActivity({ activityLog = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🕘</span>

          <h2 className="text-base font-semibold text-slate-800">
            Recent Activity
          </h2>
        </div>

        <span className="rounded-md bg-slate-100 px-3 py-1 text-lg font-medium text-slate-600 transition hover:bg-slate-200">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 p-4">
          <div className="max-h-44 overflow-y-auto">
            {activityLog.length === 0 ? (
              <p className="text-sm text-slate-400">No activity yet</p>
            ) : (
              <ul className="space-y-3 pr-2">
                {activityLog.map((event) => (
                  <li
                    key={event.id}
                    className="border-b border-slate-100 pb-2 last:border-0"
                  >
                    <p className="text-sm text-slate-700">{event.message}</p>

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