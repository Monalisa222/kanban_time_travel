class Board < ApplicationRecord
  has_many :cards, dependent: :destroy
  has_many :board_events, dependent: :destroy

  validates :name, presence: true
end
