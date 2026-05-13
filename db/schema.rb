# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_13_165542) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "board_events", force: :cascade do |t|
    t.bigint "board_id", null: false
    t.bigint "card_id", null: false
    t.datetime "created_at", null: false
    t.jsonb "event_data", default: {}, null: false
    t.string "event_type", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id", "created_at"], name: "index_board_events_on_board_id_and_created_at"
    t.index ["board_id"], name: "index_board_events_on_board_id"
    t.index ["card_id"], name: "index_board_events_on_card_id"
    t.index ["event_data"], name: "index_board_events_on_event_data", using: :gin
    t.index ["event_type"], name: "index_board_events_on_event_type"
  end

  create_table "boards", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cards", force: :cascade do |t|
    t.bigint "board_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.datetime "discarded_at"
    t.decimal "position", precision: 20, scale: 10, null: false
    t.string "status", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id", "status", "position"], name: "index_cards_on_board_id_and_status_and_position"
    t.index ["board_id"], name: "index_cards_on_board_id"
    t.index ["discarded_at"], name: "index_cards_on_discarded_at"
  end

  add_foreign_key "board_events", "boards"
  add_foreign_key "board_events", "cards"
  add_foreign_key "cards", "boards"
end
