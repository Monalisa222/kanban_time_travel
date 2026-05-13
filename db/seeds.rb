board = Board.find_or_create_by!(name: "Main Board")

board.cards.find_or_create_by!(
  title: "Sample Card",
  status: "todo"
) do |card|
  card.description = "This is a demo card"
end
