module Boards
  class ReconstructState
    def initialize(board:, timestamp:)
      @board = board
      @timestamp = timestamp
      @cards = {}
    end

    def call
      replay_events
      grouped_columns
    end

    private

    attr_reader :board, :timestamp, :cards

    def replay_events
      board.board_events
           .where(created_at: ..timestamp)
           .order(:created_at, :id)
           .find_each do |event|
        apply_event(event)
      end
    end

    def apply_event(event)
      case event.event_type
      when BoardEvent::EVENT_TYPES.fetch(:card_created)
        apply_created(event)
      when BoardEvent::EVENT_TYPES.fetch(:card_updated)
        apply_updated(event)
      when BoardEvent::EVENT_TYPES.fetch(:card_moved),
           BoardEvent::EVENT_TYPES.fetch(:card_reordered)
        apply_moved(event)
      when BoardEvent::EVENT_TYPES.fetch(:card_deleted)
        apply_deleted(event)
      end
    end

    def apply_created(event)
      card_id = event.event_data.fetch("card_id").to_i

      cards[card_id] = {
        id: card_id,
        title: event.event_data.fetch("title"),
        description: event.event_data["description"],
        status: event.event_data.fetch("status"),
        position: event.event_data.fetch("position")
      }
    end

    def apply_updated(event)
      card_id = event.event_data.fetch("card_id").to_i
      return unless cards[card_id]

      current = event.event_data.fetch("current")

      cards[card_id][:title] = current.fetch("title")
      cards[card_id][:description] = current["description"]
    end

    def apply_moved(event)
      card_id = event.event_data.fetch("card_id").to_i
      return unless cards[card_id]

      current = event.event_data.fetch("current")

      cards[card_id][:status] = current.fetch("status")
      cards[card_id][:position] = current.fetch("position")
    end

    def apply_deleted(event)
      card_id = event.event_data.fetch("card_id").to_i

      cards.delete(card_id)
    end

    def grouped_columns
      cards.values
           .group_by { |card| card[:status] }
           .transform_values do |status_cards|
        status_cards.sort_by { |card| BigDecimal(card[:position].to_s) }
      end
    end
  end
end
