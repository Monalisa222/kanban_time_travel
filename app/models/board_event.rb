class BoardEvent < ApplicationRecord
  EVENT_TYPES = {
    card_created: "card_created",
    card_updated: "card_updated",
    card_moved: "card_moved",
    card_reordered: "card_reordered",
    card_deleted: "card_deleted"
  }.freeze

  belongs_to :board
  belongs_to :card

  validates :event_type, presence: true, inclusion: { in: EVENT_TYPES.values }
  validates :event_data, presence: true
end
