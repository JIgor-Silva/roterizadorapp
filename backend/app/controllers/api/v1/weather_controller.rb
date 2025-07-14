class Api::V1::WeatherController < ApplicationController
  def show
    latitude = params[:latitude]
    longitude = params[:longitude]

    if latitude.present? && longitude.present?
      weather_data = WeatherService.get_weather(latitude, longitude)
      render json: weather_data
    else
      render json: { error: 'Latitude and longitude are required' }, status: :bad_request
    end
  end
end
