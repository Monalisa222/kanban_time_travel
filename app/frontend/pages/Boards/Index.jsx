import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function Index({ boards = [] }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) return;

    router.post(
      "/boards",
      {
        board: {
          name: name.trim(),
        },
      },
      {
        onSuccess: () => setName(""),
      }
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Boards</h1>
          <p className="mt-1 text-slate-600">
            Create a board first, then manage cards inside that board.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl bg-white p-5 shadow"
        >
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Board name
          </label>

          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: Product Roadmap"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Your Boards
          </h2>

          {boards.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-slate-600 shadow">
              No boards yet. Create your first board.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <Link href={`/boards/${board.id}`}
                  className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {board.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Open board and manage cards
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}