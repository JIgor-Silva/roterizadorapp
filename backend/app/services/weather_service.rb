require "faraday"

class WeatherService
  def self.get_weather(latitude, longitude)
    api_key = ENV["WEATHER_API_KEY"].presence || Rails.application.credentials.dig(:weather_map, :api_key)
    return {} if api_key.blank?

    current_url = "http://api.weatherapi.com/v1/current.json?key=#{api_key}&q=#{latitude},#{longitude}&lang=pt"
    current_response = Faraday.get(current_url)
    current_data = JSON.parse(current_response.body)

    forecast_url = "http://api.weatherapi.com/v1/forecast.json?key=#{api_key}&q=#{latitude},#{longitude}&days=1&lang=pt"
    forecast_response = Faraday.get(forecast_url)
    forecast_data = JSON.parse(forecast_response.body)

    {
      current: current_data["current"],
      location: current_data["location"],
      forecast: forecast_data["forecast"]
    }
  end
end
