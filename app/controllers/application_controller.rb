class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  inertia_share flash: -> {
    {
      notice: flash[:notice],
      alert: flash[:alert]
    }
  }

  rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid
  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found
  rescue_from ActionController::ParameterMissing, with: :handle_bad_request

  def handle_route_not_found
    redirect_to root_path, alert: "Page was not found."
  end

  private

  def handle_record_invalid(exception)
    redirect_back(
      fallback_location: root_path,
      alert: expection.record.errors.full_messages.to_sentence
    )
  end

  def handle_record_not_found
    redirect_to root_path, alert: "Card or board was not found."
  end

  def handle_bad_request(exception)
    redirect_back(
      fallback_location: root_path,
      alert: exception.message
    )
  end
end
