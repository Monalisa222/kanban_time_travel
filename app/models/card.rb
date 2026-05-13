class Card < ApplicationRecord
  STATUSES = {
    backlog: "backlog",
    todo: "todo",
    in_progress: "in_progress",
    in_review: "in_review",
    done: "done"
  }.freeze

  STATUS_ORDER = STATUSES.values.freeze

  belongs_to :board

  has_many :board_events, dependent: :destroy

  validates :title, presence: true, length: { maximum: 120 }
  validates :status, presence: true, inclusion: { in: STATUS_ORDER }
  validates :position, presence: true, numericality: true

  scope :active, -> { where(discarded_at: nil) }
  scope :ordered, -> { order(:position) }
end
