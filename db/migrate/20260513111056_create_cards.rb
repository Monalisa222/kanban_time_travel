class CreateCards < ActiveRecord::Migration[8.1]
  def change
    create_table :cards do |t|
      t.references :board, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description, null: false
      t.string :status, null: false
      t.decimal :position, precision: 20, scale: 10, null: false
      t.datetime :discarded_at

      t.timestamps
    end

    add_index :cards, [ :board_id, :status, :position ]
    add_index :cards, :discarded_at
  end
end
