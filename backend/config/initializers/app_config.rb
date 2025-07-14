# config/initializers/app_config.rb
module AppConfig
  mattr_accessor :use_route_service_mock
  self.use_route_service_mock = ENV["USE_ROUTE_SERVICE_MOCK"] == "true" || false
end

if Rails.env.development? && AppConfig.use_route_service_mock
  puts "[APP_CONFIG] RouteCalculationService está em MODO MOCK."
end
