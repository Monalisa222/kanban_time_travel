class CreateBoardEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :board_events do |t|
      t.references :board, null: false, foreign_key: true
      t.references :card, null: false, foreign_key: true
      t.string :event_type, null: false
      t.jsonb :event_data, null: false, default: {}

      t.timestamps
    end

    add_index :board_events, [:board_id, :created_at]
    add_index :board_events, :event_type
    add_index :board_events, :event_data, using: :gin
  end
end
