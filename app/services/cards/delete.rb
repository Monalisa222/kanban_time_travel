module Cards
  class Delete
    def initialize(card:)
      @card = card
    end

    def call
      Card.transaction do
        previous_attributes = {
          title: card.title,
          description: card.description,
          status: card.status,
          position: card.position.to_s
        }

        card.update!(discarded_at: Time.current)

        card.board.board_events.create!(
          card: card,
          event_type: BoardEvent::EVENT_TYPES.fetch(:card_deleted),
          event_data: {
            card_id: card.id,
            previous: previous_attributes
          }
        )

        card
      end
    end

    private

    attr_reader :card
  end
end
