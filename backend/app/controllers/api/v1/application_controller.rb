# frozen_string_literal: true
module Api
  module V1
    class ApplicationController < ActionController::API
      include Devise::Controllers::Helpers
      include Pundit::Authorization

      before_action :authenticate_api_v1_user!

      rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

      private

      def pundit_user
        current_api_v1_user
      end

      def user_not_authorized
        render json: { error: 'Você não está autorizado a realizar esta ação.' }, status: :forbidden
      end
    end
  end
end
