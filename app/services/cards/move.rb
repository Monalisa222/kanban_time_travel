module Cards
  class Move
    def initialize(card:, target_status:, previous_position:, next_position:)
      @card = card
      @target_status = target_status
      @previous_position = previous_position
      @next_position = next_position
    end

    def call
      validate_target_status!
      Card.transaction do
        previous_attributes = {
          status: card.status,
          position: card.position.to_s
        }

        new_position = PositionCalculator.new(
          previous_position: previous_position,
          next_position: next_position
        ).call

        card.update!(
          status: target_status,
          position: new_position
        )

        record_event(previous_attributes)

        card
      end
    end

    private

    attr_reader :card, :target_status, :previous_position, :next_position

    def validate_target_status!
      return if Card::STATUS_ORDER.include?(target_status)

      raise ActiveRecord::RecordInvalid, card
    end

    def record_event(previous_attributes)
      event_type =
        if previous_attributes[:status] == card.status
          BoardEvent::EVENT_TYPES.fetch(:card_reordered)
        else
          BoardEvent::EVENT_TYPES.fetch(:card_moved)
        end

      card.board.board_events.create!(
        card: card,
        event_type: event_type,
        event_data: {
          card_id: card.id,
          previous: previous_attributes,
          current: {
            status: card.status,
            position: card.position.to_s
          }
        }
      )
    end
  end
end
