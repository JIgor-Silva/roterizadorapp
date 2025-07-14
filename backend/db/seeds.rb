# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
# db/seeds.rb

# Limpa os dados existentes para evitar duplicatas ao rodar o seed múltiplas vezes.
# A ordem é importante devido às dependências de chave estrangeira.
puts "Cleaning database..."
RoutePoint.destroy_all
Route.destroy_all
Order.destroy_all
User.destroy_all # Usuários podem depender de Lojas
Client.destroy_all
Store.destroy_all
puts "Database cleaned."

puts "Creating Stores..."
# Usando Pontos de Interesse conhecidos para máxima confiabilidade na geocodificação.
store1_address = "Shopping Iguatemi Bosque, Fortaleza, CE"
store1_coords = Geocoder.search(store1_address).first&.coordinates
if store1_coords
  store1 = Store.find_or_create_by!(name: "Loja - Shopping Iguatemi Bosque") do |s|
    s.address = store1_address
    s.latitude = store1_coords[0]
    s.longitude = store1_coords[1]
  end
else
  puts "ERRO: Não foi possível geocodificar a Loja - Shopping Iguatemi Bosque. Abortando."
  exit
end

store2_address = "North Shopping Jóquei, Fortaleza, CE"
store2_coords = Geocoder.search(store2_address).first&.coordinates
if store2_coords
  store2 = Store.find_or_create_by!(name: "Loja - North Shopping Jóquei") do |s|
    s.address = store2_address
    s.latitude = store2_coords[0]
    s.longitude = store2_coords[1]
  end
else
  puts "ERRO: Não foi possível geocodificar a Loja - North Shopping Jóquei. Abortando."
  exit
end
puts "Stores available: #{Store.count}"

puts "Creating Users (Admins and Delivery People)..."
# A senha padrão para todos os usuários criados será 'password'

# Usuários para a Loja 1
admin_s1 = User.find_or_create_by!(email: "admin.loja1@example.com") do |u|
  u.password = "password"
  u.password_confirmation = "password"
  u.role = :admin
  u.store = store1
end

entregador1_s1 = User.find_or_create_by!(email: "entregador1.loja1@example.com") do |u|
  u.password = "password"
  u.password_confirmation = "password"
  u.role = :delivery_person
  u.store = store1
end

entregador2_s1 = User.find_or_create_by!(email: "entregador2.loja1@example.com") do |u|
  u.password = "password"
  u.password_confirmation = "password"
  u.role = :delivery_person
  u.store = store1
end

# Usuários para a Loja 2
admin_s2 = User.find_or_create_by!(email: "admin.loja2@example.com") do |u|
  u.password = "password"
  u.password_confirmation = "password"
  u.role = :admin
  u.store = store2
end

entregador1_s2 = User.find_or_create_by!(email: "entregador1.s2@example.com") do |u|
  u.password = "password"
  u.password_confirmation = "password"
  u.role = :delivery_person
  u.store = store2
end
puts "Users created: #{User.count}. Admins: #{User.admin.count}, Delivery People: #{User.delivery_person.count}"

puts "Creating Clients..."
clients = []

# Lista de endereços corrigidos e específicos para garantir a geocodificação.
client_addresses = [
  "Rua Major Facundo, 848, Fortaleza, CE", # Endereço do teste de sucesso
  "Avenida Bezerra de Menezes, 2450, Fortaleza, CE", # North Shopping
  "Rua Araré, 1017, Caucaia, CE",
  "Rua Heribaldo Rodrigues, 358, Caucaia, CE",
  "Rua Tomás Rodrigues, 125, Fortaleza, CE",
  "Rua Professor Joaquim Nogueira, 283, Fortaleza, CE",
  "Rua Osvaldo Cruz, 1700, Fortaleza, CE",
  "Rua Dom Expedito Lopes, 1884, Fortaleza, CE",
  "Rua Bárbara de Alencar, 290, Fortaleza, CE",
  "Rua Monsenhor Bruno, 1380, Fortaleza, CE",
  "Rua Patriolino Aguiar, 119, Fortaleza, CE",
  "Rua Deputado João Lopes, 12, Fortaleza, CE",
  "Rua Floriano Peixoto, 356, Fortaleza, CE",
  "Avenida Dom Almeida Lustosa, 2788, Caucaia, CE",
  "Rua General Sampaio, 1630, Fortaleza, CE"
]

client_addresses.each_with_index do |address, i|
  # Usando a gem Geocoder para obter as coordenadas
  coords = Geocoder.search(address).first&.coordinates

  if coords
    clients << Client.create!(
      name: "Cliente #{i + 1}",
      address: address,
      phone: "(85) 9#{rand(1000..9999)}-#{rand(1000..9999)}",
      latitude: coords[0],
      longitude: coords[1]
    )
    puts "    Created Client #{clients.last.id} for address: '#{address}'"
  else
    puts "    Skipping Client #{i + 1} due to geocoding error for address: '#{address}'"
  end
end
puts "Clients created: #{Client.count}"

puts "Creating Orders..."

# Desabilita o callback de enfileiramento de rota durante o seeding
Order.skip_callback(:create, :after, :enqueue_route_calculation)

possible_statuses = [:pending, :in_route, :delivered, :cancelled]
all_stores = [store1, store2]
all_delivery_people = [entregador1_s1, entregador2_s1, entregador1_s2]

clients.each do |client| # Iterar sobre os clientes que foram realmente criados
  store = all_stores.sample
  status = possible_statuses.sample
  delivery_person = (status == :delivered || status == :cancelled) ? nil : all_delivery_people.sample # Atribui entregador apenas se não for entregue/cancelado
  is_late = (status == :in_route && rand(10) < 3) # ~30% de chance de estar atrasado se estiver em rota

  order = Order.create!(
    client: client,
    store: store,
    delivery_address: client.address,
    status: status,
    delivery_person: delivery_person,
    total: rand(50.0..500.0).round(2),
    is_late: is_late # Atribui o status de atraso
  )

  # Criar rota para cada pedido
  route = Route.create!(
    store: order.store,
    order: order,
    origin_latitude: order.store.latitude,
    origin_longitude: order.store.longitude,
    destination_latitude: order.client.latitude,
    destination_longitude: order.client.longitude,
    travel_mode: "driving", # Modo de viagem padrão
    distance: rand(1000..15000).to_f, # Distância em metros (placeholder)
    duration: rand(10..60) # Duração em minutos (placeholder)
  )
  puts "  Route created for Order ID: #{order.id} with Destination Lat: #{route.destination_latitude}, Lon: #{route.destination_longitude}"

  # Criando alguns RoutePoints de exemplo (origem, meio aproximado, destino)
  RoutePoint.create!(route: route, latitude: route.origin_latitude, longitude: route.origin_longitude, order: 0) # Ponto de origem

  # Ponto intermediário (cálculo simples, não reflete uma rota real)
  mid_lat = (route.origin_latitude + route.destination_latitude) / 2
  mid_lon = (route.origin_longitude + route.destination_longitude) / 2
  RoutePoint.create!(route: route, latitude: mid_lat, longitude: mid_lon, order: 1)

  RoutePoint.create!(route: route, latitude: route.destination_latitude, longitude: route.destination_longitude, order: 2) # Ponto de destino
  puts "    RoutePoints created for Route ID: #{route.id}"
end

# Reabilita o callback após o seeding
Order.set_callback(:create, :after, :enqueue_route_calculation)

puts "Orders created: #{Order.count}"
puts "Routes created: #{Route.count}"
puts "RoutePoints created: #{RoutePoint.count}"

puts "Seed data creation finished!"
