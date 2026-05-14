class CardsController < ApplicationController
  before_action :set_board
  before_action :set_card, only: [ :update ]

  rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid
  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

  def create
    board = Board.find(params[:board_id])

    ::Cards::Create.new(board: board, params: card_params).call

    redirect_to board_path(board), notice: "Card created successfully."
  end

  def update
    ::Cards::Update.new(
      card: @card,
      params: card_params
    ).call

    redirect_to board_path(@board), notice: "Card updated successfully."
  end

  private

  def set_board
    @board = Board.find(params[:board_id])
  end

  def set_card
    @card = @board.cards.active.find(params[:id])
  end

  def card_params
    params.require(:card).permit(:board_id, :title, :description, :status)
  end

  def handle_record_invalid(exception)
    redirect_to board_path(@board), alert: exception.record.errors.full_messages.to_sentence
  end

  def handle_record_not_found
    redirect_to root_path, alert: "Card or board was not found."
  end
end
