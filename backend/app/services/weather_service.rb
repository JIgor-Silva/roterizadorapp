# frozen_string_literal: true

require "faraday"

class WeatherService
  BASE_URL = "https://api.weatherapi.com/v1"

  def self.get_weather(latitude, longitude)
    api_key = ENV["WEATHER_API_KEY"].presence || Rails.application.credentials.dig(:weather_map, :api_key)
    return { error: "Chave da WeatherAPI não configurada." } if api_key.blank?

    query = { key: api_key, q: "#{latitude},#{longitude}", lang: "pt" }
    current_response = Faraday.get("#{BASE_URL}/current.json", query)
    return { error: "Erro na WeatherAPI: #{current_response.status}" } unless current_response.success?

    forecast_response = Faraday.get("#{BASE_URL}/forecast.json", query.merge(days: 1))
    return { error: "Erro na WeatherAPI: #{forecast_response.status}" } unless forecast_response.success?

    current_data = JSON.parse(current_response.body)
    forecast_data = JSON.parse(forecast_response.body)

    {
      current: current_data["current"],
      location: current_data["location"],
      forecast: forecast_data["forecast"]
    }
  rescue Faraday::Error, JSON::ParserError => e
    Rails.logger.error("Erro ao consultar WeatherAPI: #{e.message}")
    { error: "Serviço de clima indisponível." }
  end
end
