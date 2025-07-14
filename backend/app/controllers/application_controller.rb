class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  include Pundit::Authorization
  protect_from_forgery with: :null_session
  before_action :skip_session_storage
  respond_to :json
  private

  def skip_session_storage
    request.session_options[:skip] = true
  end

  def pundit_user
    current_api_v1_user
  end
end
