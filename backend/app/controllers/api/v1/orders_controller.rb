# frozen_string_literal: true
class Api::V1::OrdersController < Api::V1::ApplicationController
  before_action :set_order, only: [:show, :update, :route_details, :calculate_route]
  before_action :authorize_order, only: [:show, :update, :route_details, :calculate_route]

  # GET /api/v1/orders
  def index
    @orders = pundit_policy_scope(Order)
    .includes(:client, :store, :delivery_person, :route)
    .order(created_at: :desc)
    render json: @orders, each_serializer: Api::V1::OrderSerializer
  end

  # GET /api/v1/orders/:id
  def show
    render json: @order, include: [:client, :store, :delivery_person, { route: { include: :route_points } }], serializer: Api::V1::OrderSerializer
  end

  # GET /api/v1/orders/delivery_person/:id
  def delivery_person_orders
    # Garante que apenas o próprio entregador ou um admin possa ver esses pedidos
    if current_api_v1_user.role == 'delivery_person' && current_api_v1_user.id.to_s != params[:id]
      return render json: { error: 'Acesso não autorizado.' }, status: :unauthorized
    end

    @orders = pundit_policy_scope(Order)
              .where(delivery_person_id: params[:id])
              .includes(:client, :store, :delivery_person, :route)
              .order(created_at: :desc)
    render json: @orders, each_serializer: Api::V1::OrderSerializer
  end

  # POST /api/v1/orders
  def create
    authorize Order, :create?

    client_name = order_creation_params[:client_name]
    client_address = order_creation_params[:client_address]
    travel_mode = order_creation_params[:travel_mode] || 'driving'

    unless client_name.present? && client_address.present?
      return render json: { error: 'Nome e endereço do cliente são obrigatórios.' }, status: :bad_request
    end

    store = current_api_v1_user.store
    store ||= Store.first # se o usuário não tiver uma loja associada ou se store for nil.
    unless store
      return render json: { error: 'Nenhuma loja encontrada.' }, status: :not_found
    end
    # Verificar rota existente
    existing_route = Route.joins(:order)
                         .where(store: store, orders: { delivery_address: client_address })
                         .order(created_at: :desc)
                         .first

    if existing_route
      return render json: { message: 'Rota existente encontrada!', route_id: existing_route.id }, status: :ok
    end

    begin
      ActiveRecord::Base.transaction do
        client = Client.find_or_create_by!(name: client_name, address: client_address) do |c|
          c.latitude = geocode_address(client_address)[:latitude]
          c.longitude = geocode_address(client_address)[:longitude]
        end

        order = Order.create!(client: client, store: store, delivery_address: client_address, status: :pending)
        calculate_and_save_route(order, store, client_address, travel_mode)

        render json: { message: 'Rota calculada e salva com sucesso!', route_id: order.route.id }, status: :created
      end
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error("Erro ao criar pedido/rota: #{e.message}")
      render json: { error: "Erro ao salvar o pedido: #{e.message}" }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/orders/:id
  def update
    if @order.update(order_update_params)
      render json: @order, serializer: Api::V1::OrderSerializer
    else
      render json: { error: @order.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/orders/:id/route_details
  def route_details
    route = @order.route
    if route
      # Se a polilinha não estiver preenchida, calcula e atualiza
      unless route.polyline.present?
        # Montamos as coordenadas  padrão interno: [latitude, longitude]
        origin_coords = [ @order.store.latitude, @order.store.longitude]
        destination_coords = [ @order.client.latitude, @order.client.longitude]

        route_data = RouteCalculationService.calculate_route(origin_coords, destination_coords)

        if route_data[:error]
          Rails.logger.error "Erro ao calcular rota sob demanda: #{route_data[:error]}"
          return render json: { error: 'Não foi possível calcular a rota para este pedido.' }, status: :unprocessable_entity
        end

        begin
          ActiveRecord::Base.transaction do
            route.update!(
              distance: route_data[:distance],
              duration: route_data[:duration],
              polyline: route_data[:geometry]
            )

            # Limpa e recria os RoutePoints
            route.route_points.destroy_all
            route_data[:geometry].each_with_index do |coord, index|
              RoutePoint.create!(route: route, longitude: coord[0], latitude: coord[1], order: index)
            end
          end
        rescue ActiveRecord::RecordInvalid => e
          Rails.logger.error("Falha ao salvar a rota atualizada: #{e.message}")
          return render json: { error: 'Não foi possível salvar os detalhes da rota.' }, status: :unprocessable_entity
        end
      end
      render json: route, include: :route_points, serializer: Api::V1::RouteSerializer
    else
      render json: { error: 'Rota não encontrada para este pedido.' }, status: :not_found
    end
  end

  # POST /api/v1/orders/:id/calculate_route
  def calculate_route
    if @order.route
      return render json: { message: 'Este pedido já possui uma rota.', route_id: @order.route.id }, status: :ok
    end

    travel_mode = params[:travel_mode] || 'driving'
    begin
      ActiveRecord::Base.transaction do
        # cria a rota inicial, sem preencher a polilinha
        # A polilinha será preenchida sob demanda em route_details
        calculate_and_save_route(@order, @order.store, @order.delivery_address, travel_mode)
        render json: { message: 'Rota criada com sucesso! A polilinha será calculada na primeira visualização.', route_id: @order.route.id }, status: :created
      end
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error("Erro ao calcular rota: #{e.message}")
      render json: { error: "Erro ao calcular a rota: #{e.message}" }, status: :unprocessable_entity
    end
  end

  private

  def set_order
    @order = Order.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Pedido não encontrado.' }, status: :not_found
  end

  def order_creation_params
    params.permit(:client_name, :client_address, :order_number, :travel_mode)
  end

  def order_update_params
    return {} unless params[:order].present?

    permitted = if policy(@order).update_status_and_delivery_person?
                  [:status, :delivery_person_id]
                elsif policy(@order).update_status?
                  [:status]
                else
                  []
                end
    params.require(:order).permit(*permitted)
  end

  def authorize_order
    authorize @order, "#{action_name}?".to_sym
  end

  def geocode_address(address)
    coordinates_array = RouteCalculationService.geocode_address(address)
    if coordinates_array.is_a?(Array) && coordinates_array.length == 2 &&
       coordinates_array.all? { |coord| coord.is_a?(Numeric) }
      { latitude: coordinates_array[0], longitude: coordinates_array[1] }
    else
      # Retorna um hash de erro em vez de levantar uma exceção
      { error: 'Endereço não geocodificado.' }
    end
  end

  # registro da rota, sem preencher a polilinha
  def calculate_and_save_route(order, store, address, travel_mode)
    client_coordinates = geocode_address(address)

    # Se a geocodificação falhar, não cria a rota
    if client_coordinates[:error]
      Rails.logger.error("Erro na geocodificação ao criar rota: #{client_coordinates[:error]}")
      raise ActiveRecord::RecordInvalid, client_coordinates[:error]
    end

    route = Route.create!(
      store: store,
      order: order,
      origin_latitude: store.latitude,
      origin_longitude: store.longitude,
      destination_latitude: client_coordinates[:latitude],
      destination_longitude: client_coordinates[:longitude],
      travel_mode: travel_mode,
      distance: 0,
      duration: 0
    )

    order.update!(status: :in_route)
  end
end
