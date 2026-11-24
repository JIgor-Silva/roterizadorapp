# frozen_string_literal: true

class Api::V1::WeatherController < Api::V1::ApplicationController
  def show
    latitude = params[:latitude]
    longitude = params[:longitude]

    unless latitude.present? && longitude.present?
      return render json: { error: "Latitude e longitude são obrigatórias." }, status: :bad_request
    end

    weather_data = WeatherService.get_weather(latitude, longitude)
    if weather_data[:error]
      render json: { error: weather_data[:error] }, status: :bad_gateway
    else
      render json: weather_data
    end
  end
end
