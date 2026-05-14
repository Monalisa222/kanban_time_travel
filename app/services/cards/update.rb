module Cards
  class Update
    def initialize(card:, params:)
      @card = card
      @params = params
    end

    def call
      Card.transaction do
        previous_attributes = {
          title: card.title,
          description: card.description
        }

        card.update!(
          title: title,
          description: description
        )

        record_event(previous_attributes)

        card
      end
    end

    private

    attr_reader :card, :params

    def title
      params[:title].to_s.strip
    end

    def description
      params[:description].to_s.strip.presence
    end

    def record_event(previous_attributes)
      card.board.board_events.create!(
        card: card,
        event_type: BoardEvent::EVENT_TYPES.fetch(:card_updated),
        event_data: {
          card_id: card.id,
          previous: previous_attributes,
          current: {
            title: card.title,
            description: card.description
          }
        }
      )
    end
  end
end
