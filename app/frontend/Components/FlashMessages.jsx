import { usePage } from "@inertiajs/react"

export default function FlashMessages() {
  const { flash } = usePage().props

  return (
    <>
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
    </>
  )
}