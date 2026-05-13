module Cards
  class Create
    DEFAULT_POSITION_STEP = 1_000

    def initialize(board:, params:)
      @board = board
      @params = params
    end

    def call
      Card.transaction do
        card = board.cards.create!(
          title: title,
          description: description,
          status: status,
          position: next_position
        )

        board.board_events.create!(
          board: @board,
          card: card,
          event_type: BoardEvent::EVENT_TYPES.fetch(:card_created),
          event_data: {
            card_id: card.id,
            title: card.title,
            description: card.description,
            status: card.status,
            position: card.position.to_s
          }
        )

        card
      end
    end

    private

    attr_reader :board, :params

    def title
      params.fetch(:title).to_s.strip
    end

    def description
      params.fetch(:description).to_s.strip.presence
    end

    def status
      params.fetch(:status).presence || Card::STATUSES.fetch(:backlog)
    end

    def next_position
      last_position = board.cards.where(status: status).maximum(:position)
      return DEFAULT_POSITION_STEP unless last_position

      last_position + DEFAULT_POSITION_STEP
    end
  end
end
