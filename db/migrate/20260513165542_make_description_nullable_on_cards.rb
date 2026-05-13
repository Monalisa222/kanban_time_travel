class MakeDescriptionNullableOnCards < ActiveRecord::Migration[8.1]
  def change
    change_column_null :cards, :description, true
  end
end
