# spec/services/route_calculation_service_spec.rb
require 'rails_helper'

RSpec.describe RouteCalculationService, type: :service do
  describe '.geocode_address' do
    it 'returns mock coordinates' do
      coordinates = RouteCalculationService.geocode_address('Rua Exemplo')
      expect(coordinates).to eq([-23.55, -46.63])
    end
  end

  describe '.calculate_route' do
    it 'returns mock route data' do
      origin = [-23.550520, -46.633308]
      destination = [-23.55, -46.63]
      route_data = RouteCalculationService.calculate_route(origin, destination)
      expect(route_data[:distance]).to eq(1000.0)
      expect(route_data[:geometry]).to be_an(Array)
    end
  end
end
