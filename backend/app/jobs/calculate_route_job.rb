class CalculateRouteJob < ApplicationJob
  queue_as :default

  def perform(order_id)
    order = Order.find_by(id: order_id)
    return unless order

    # (origem)
    store_coordinates = [order.store.latitude, order.store.longitude]

    # (destino)
    client_coordinates = [order.client.latitude, order.client.longitude]

    route_data = RouteCalculationService.calculate_route(store_coordinates, client_coordinates)

    if route_data[:error]
      Rails.logger.error "Erro ao calcular rota para o pedido #{order.id}: #{route_data[:error]}"
    else
      # rota associada ao pedido
      route = order.route || order.build_route
      route.distance = route_data[:distance]
      route.duration = route_data[:duration]
      route.polyline = route_data[:geometry].to_json

      if route.save
      else
        Rails.logger.error "Erro ao salvar rota para o pedido #{order.id}: #{route.errors.full_messages.join(', ')}"
      end
    end
  end
end
