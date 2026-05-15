# Kanban Board with Time Travel

A single-board Kanban application built with Ruby on Rails, React, Inertia.js, Tailwind CSS, and PostgreSQL.

---

# Tech Stack

- Ruby 3.3.x
- Rails 8.x
- PostgreSQL
- React
- Inertia.js
- Vite
- Tailwind CSS

---

# Features

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

---

# Local Setup

```bash
git clone https://github.com/Monalisa222/kanban_time_travel/
cd kanban_time_travel

bundle install
npm install

bin/rails db:create db:migrate db:seed

bin/dev
```

---

# Architecture Overview

## Current State vs Historical State

The application uses a hybrid architecture:

- The `cards` table stores the current live state of the board.
- The `board_events` table stores an append-only event history.

This approach was intentionally chosen instead of relying entirely on event sourcing.

A pure event-sourced system would require replaying all historical events for every board request, which becomes increasingly expensive as event volume grows.

### The hybrid design provides:

1. Fast live board rendering
2. Efficient drag-and-drop updates
3. Historical reconstruction support
4. Cleaner operational queries

---

# Database Design

## 1. boards

Stores board metadata.

### Important fields

- `name`

---

## 2. cards

Stores the current live board state.

### Important fields

- `board_id`
- `title`
- `description`
- `status`
- `position`
- `discarded_at`

---

## Soft Delete

Cards are soft-deleted using `discarded_at`.

This preserves historical references for timeline reconstruction and activity logging.

---

## 3. board_events

Stores immutable historical events.

### Important fields

- `board_id`
- `card_id`
- `event_type`
- `event_data`
- `created_at`

---

# Supported Events

- `card_created`
- `card_updated`
- `card_moved`
- `card_reordered`
- `card_deleted`

---

# Ordering Strategy

Card ordering uses a gap-based positioning strategy instead of sequential integers.

### Example

```text
1000
2000
3000
```

If a card is inserted between `1000` and `2000`, the new position becomes:

```text
1500
```

This approach avoids updating every row in a column during reorder operations.

### Benefits

1. Minimal database writes
2. Efficient drag-and-drop operations
3. Better scalability
4. Reduced lock contention

---

# Historical Reconstruction

Historical reconstruction is handled by:

- `Boards::ReconstructState`

## Reconstruction Process

1. Fetch all events up to a selected timestamp
2. Replay events chronologically
3. Rebuild board state in memory
4. Group cards by status
5. Sort cards by position

Historical state rendering is read-only.

Editing, deleting, and drag-and-drop actions are disabled while viewing historical snapshots.

---

# Activity Log

The activity log is generated from recent `board_events`.

Only recent events are loaded:

```ruby
.limit(20)
```

This keeps rendering performant even as total historical event volume grows.

Human-readable messages are generated server-side for consistency and simpler frontend rendering.

---

# Service Object Architecture

Business logic is isolated into service objects.

## Card Services

1. `Cards::Create`
2. `Cards::Update`
3. `Cards::Delete`
4. `Cards::Move`
5. `Cards::PositionCalculator`

## Board Services

1. `Boards::ReconstructState`

### Benefits

1. Thin controllers
2. Clear separation of concerns
3. Easier maintenance
4. Easier scalability
5. Cleaner future testing support

---

# Error Handling

The application includes:

1. ActiveRecord transaction wrapping
2. Validation handling
3. Safe board/card lookup
4. Invalid drag target protection
5. Read-only historical protection
6. Graceful flash messaging

---

# Scaling Discussion

## Handling 100,000+ Historical Events

The current implementation is suitable for moderate event volumes and local development.

For production-scale workloads, the following improvements would be introduced:

---

## 1. Snapshotting

Periodic board snapshots would be stored.

Instead of replaying all historical events:

```text
Load nearest snapshot
Replay only newer events
```

This significantly reduces reconstruction time.

---

## 2. Event Pagination

Activity logs would use:

- Cursor pagination
- Infinite scrolling
- Lazy loading

instead of loading recent events directly.

---

## 3. Background Event Processing

Certain event formatting and analytics workloads could be moved into background jobs using Sidekiq.

---

## 4. Optimized Timeline Queries

Additional indexes would be added for:

- `created_at`
- `board_id`
- `event_type`

Composite indexes and partitioning could also be introduced for very large datasets.

---

## 5. Position Rebalancing

Gap-based ordering can eventually produce very dense position values after many reorder operations.

A rebalance job could periodically normalize positions:

```text
1000
2000
3000
```

without affecting user experience.

---

## 6. Read Replicas

Historical reconstruction and activity queries could be moved to database read replicas to reduce load on primary write nodes.

---

# Tradeoffs Considered

## Pure Event Sourcing

### Pros

1. Perfect audit history
2. Fully reconstructable state

### Cons

1. Expensive live queries
2. Complex operational reads
3. Higher reconstruction cost

---

## Sequential Ordering

### Pros

1. Simple implementation

### Cons

1. Reordering updates many rows
2. Poor scalability
3. Higher write amplification

---

# Final Notes

The project intentionally prioritizes:

1. Clear architecture
2. Incremental development
3. Maintainability
4. Scalability considerations
5. Production-oriented patterns
6. Clean commit history
7. Readable service-oriented code