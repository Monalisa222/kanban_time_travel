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
    Card::STATUS_ORDER.map do |status|
      {
        key: status,
        title: Card::STATUS_LABELS.fetch(status),
        cards: []
      }
    end
  end
end
