module Cards
  class PositionCalculator
    DEFAULT_STEP = 1_000.to_d

    def initialize(previous_position:, next_position:)
      @previous_position = previous_position
      @next_position = next_position
    end

    def call
      return DEFAULT_STEP if previous_position.blank? && next_position.blank?
      return next_position.to_d / 2 if previous_position.blank?
      return previous_position.to_d + DEFAULT_STEP if next_position.blank?

      (previous_position.to_d + next_position.to_d) / 2
    end

    private

    attr_reader :previous_position, :next_position
  end
end
