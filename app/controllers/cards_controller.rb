class CardsController < ApplicationController
  rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid

  def create
    board = Board.find(params[:board_id])

    ::Cards::Create.new(board: board, params: card_params).call

    redirect_to board_path(board), notice: "Card created successfully."
  end

  private

  def card_params
    params.require(:card).permit(:board_id, :title, :description, :status)
  end

  def handle_record_invalid(exception)
    redirect_to root_path, inertia: {
      errors: exception.error.record.errors.to_hash(true)
    }
  end
end
