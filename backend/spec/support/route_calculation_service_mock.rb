# spec/support/route_calculation_service_mock.rb
module RouteCalculationServiceMock
  def self.geocode_address(address)
    # Retorna coordenadas fixas para qualquer endereço, simulando a API do Geocoder
    # Formato: [latitude, longitude]
    [-23.55, -46.63]
  end

  def self.calculate_route(origin, destination)
    # Retorna um hash com distance, duration e geometry, simulando a API do OpenRouteService
    {
      distance: 1000.0, # Distância em metros
      duration: 600, # Duração em segundos
      geometry: [
        [origin[1], origin[0]], # Ponto de origem (longitude, latitude)
        [(origin[1] + destination[1]) / 2, (origin[0] + destination[0]) / 2], # Ponto intermediário
        [destination[1], destination[0]] # Ponto de destino
      ]
    }
  end
end
# spec/support/route_calculation_service_mock.rb
RSpec.configure do |config|
  config.before(:each) do
    allow(RouteCalculationService).to receive(:geocode_address).and_return([-23.55, -46.63])
    allow(RouteCalculationService).to receive(:calculate_route).and_return({
      distance: 1000.0,
      duration: 600,
      geometry: [
        [-46.633308, -23.550520], # Origem
        [-46.631654, -23.550260], # Intermediário
        [-46.63, -23.55]          # Destino
      ]
    })
  end
end
