# frozen_string_literal: true
module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      def create
        user = User.new(user_params)

        if user.save
          render json: {
            status: 200,
            message: "Signed up successfully.",
            user: user.as_json(only: [ :id, :email, :created_at ])
          }, status: :ok
        else
          render json: {
            status: 422,
            message: user.errors.full_messages.join(', ')
          }, status: :unprocessable_entity
        end
      end

      private
      def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :store_id, :role)
      end
      def user_params
        params.require(:user).permit(:email, :password)
      end
    end
  end
end
