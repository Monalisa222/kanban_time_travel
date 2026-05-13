class BoardsController < ApplicationController
  def show
    board = Board.first!

    render inertia: "Boards/Show", props: {
      board: {
        id: board.id,
        name: board.name
      },
      columns: columns
    }
  end

  private

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
