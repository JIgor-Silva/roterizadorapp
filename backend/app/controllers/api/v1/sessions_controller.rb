# frozen_string_literal: true
module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json

      def create
        login_params = params[:user] || params.dig(:session, :user) || {}
        user = User.find_by(email: login_params[:email])

        if user&.valid_password?(login_params[:password])
          sign_in(user)
          render json: {
            status: 200,
            message: "Logged in successfully.",
            user: {
              id: user.id,
              email: user.email,
              name: user.email,
              role: user.role,
              store_id: user.store_id,
              store_name: user.store&.name
            },
            token: request.env["warden-jwt_auth.token"]
          }
        else
          render json: {
            status: 401,
            message: "Invalid email or password"
          }, status: :unauthorized
        end
      end

      private

      def respond_to_on_destroy
        head :no_content
      end
    end
  end
end
