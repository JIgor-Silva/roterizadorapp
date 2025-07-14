# app/services/route_calculation_service.rb
require "httparty"
require "json"

class RouteCalculationService
  BASE_URL = "https://api.openrouteservice.org"
  API_KEY = Rails.application.credentials.dig(:open_route_service, :api_key)

  # coordenadas no formato [LATITUDE, LONGITUDE]
  def self.calculate_route(origin_lat_lon, destination_lat_lon)
    return { error: "Chave da API do OpenRouteService não configurada." } if API_KEY.blank?

    profile = "driving-hgv"
    directions_url = "#{BASE_URL}/v2/directions/#{profile}/geojson"

    headers = {
      "Authorization" => API_KEY,
      "Content-Type" => "application/json"
    }

    body = {
      # API do ORS[longitude, latitude].
      "coordinates" => [
        origin_lat_lon.reverse,
        destination_lat_lon.reverse
      ],
      "radiuses" => [ -1, -1 ],
      "language" => "pt",

      "preference" => "recommended"

    }.to_json

    begin
      response = HTTParty.post(directions_url, headers: headers, body: body, timeout: 15)

      if response.success?
        parsed_body = JSON.parse(response.body)
        route_feature = parsed_body["features"]&.first

        if route_feature && route_feature.dig("properties", "summary") && route_feature["geometry"]
          summary = route_feature["properties"]["summary"]
          {
            distance: summary["distance"],
            duration: summary["duration"],
            geometry: route_feature["geometry"]["coordinates"]
          }
        else
          Rails.logger.error "Estrutura da resposta da API de rotas inesperada: #{parsed_body.inspect}"
          { error: "Nenhuma rota encontrada na resposta da API." }
        end
      else
        Rails.logger.error "Erro na API do OpenRouteService: #{response.code} - #{response.body}"
        { error: "Erro na API do OpenRouteService: #{response.code} - #{response.message}" }
      end
    rescue HTTParty::Error, JSON::ParserError => e
      Rails.logger.error "Erro de conexão com OpenRouteService: #{e.message}"
      { error: "Erro de conexão: #{e.message}" }
    end
  end
end
