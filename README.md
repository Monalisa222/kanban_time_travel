# Kanban Board with Time Travel

A single-board Kanban application built with Ruby on Rails, React, Inertia.js, Tailwind CSS, and PostgreSQL.

## Tech Stack

- Ruby 3.3.x
- Rails 8.x
- PostgreSQL
- React
- Inertia.js
- Vite
- Tailwind CSS

## Features

- Create cards
- Edit cards
- Move cards between columns
- Reorder cards inside a column
- Delete cards using soft delete
- Persist efficient card ordering
- Record every board change as an event
- Reconstruct board state at a previous timestamp
- Timeline slider for historical view
- Read-only historical mode
- Recent activity log

## Local Setup

```bash
git clone https://github.com/Monalisa222/kanban_time_travel/
cd kanban_time_travel
bundle install
npm install
bin/rails db:create db:migrate db:seed
bin/dev