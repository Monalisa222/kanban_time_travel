class BoardsController < ApplicationController
  before_action :set_board, only: [ :show ]

  def index
    boards = Board.order(created_at: :desc)

    render inertia: "Boards/Index", props: {
      boards: boards.as_json(only: [ :id, :name ])
    }
  end

  def create
    board = Board.create!(board_params)

    redirect_to board_path(board), notice: "Board created successfully."
  end

  def show
    render inertia: "Boards/Show", props: {
      board: {
        id: @board.id,
        name: @board.name
      },
      columns: columns,
      activity_log: activity_log,
      flash: {
        notice: flash[:notice],
        alert: flash[:alert]
      }
    }
  end

  private

  def board_params
    params.require(:board).permit(:name)
  end

  def set_board
    @board = params[:id].present? ? Board.find(params[:id]) : Board.first!
  end

  def columns
    cards_by_status = @board.cards.active.ordered.group_by(&:status)

    Card::STATUS_ORDER.map do |status|
      {
        key: status,
        title: Card::STATUS_LABELS.fetch(status),
        cards: serialize_cards(cards_by_status.fetch(status, []))
      }
    end
  end

  def serialize_cards(cards)
    cards.map do |card|
      {
        id: card.id,
        title: card.title,
        description: card.description,
        status: card.status,
        position: card.position.to_s
      }
    end
  end

  def activity_log
    @board.board_events
          .includes(:card)
          .order(created_at: :desc)
          .limit(20)
          .map do |event|
      {
        id: event.id,
        message: activity_message(event),
        created_at: event.created_at.strftime("%d %b %Y, %I:%M %p")
      }
    end
  end
  def activity_message(event)
    case event.event_type
    when BoardEvent::EVENT_TYPES.fetch(:card_created)
      "Card '#{event.event_data.dig('title')}' created"
    when BoardEvent::EVENT_TYPES.fetch(:card_updated)
      "Card '#{event.event_data.dig('current', 'title')}' updated"
    when BoardEvent::EVENT_TYPES.fetch(:card_moved)
      "Card moved from #{status_label(event.event_data.dig('previous', 'status'))} to #{status_label(event.event_data.dig('current', 'status'))}"
    when BoardEvent::EVENT_TYPES.fetch(:card_reordered)
      "Card reordered in #{status_label(event.event_data.dig('current', 'status'))}"
    when BoardEvent::EVENT_TYPES.fetch(:card_deleted)
      "Card '#{event.event_data.dig('previous', 'title')}' deleted"
    else
      "Board updated"
    end
  end

  def status_label(status)
    Card::STATUS_LABELS.fetch(status, status.to_s.titleize)
  end
end
