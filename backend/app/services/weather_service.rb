require 'faraday'

class WeatherService
  def self.get_weather(latitude, longitude)
    api_key = Rails.application.credentials.weather_map[:api_key]

    # Fetch current weather
    current_url = "http://api.weatherapi.com/v1/current.json?key=#{api_key}&q=#{latitude},#{longitude}&lang=pt"
    current_response = Faraday.get(current_url)
    current_data = JSON.parse(current_response.body)

    # Fetch forecast for probability of precipitation
    forecast_url = "http://api.weatherapi.com/v1/forecast.json?key=#{api_key}&q=#{latitude},#{longitude}&days=1&lang=pt"
    forecast_response = Faraday.get(forecast_url)
    forecast_data = JSON.parse(forecast_response.body)

    # Combine data
    combined_data = {
      current: current_data['current'],
      location: current_data['location'],
      forecast: forecast_data['forecast']
    }
    combined_data
  end
end
