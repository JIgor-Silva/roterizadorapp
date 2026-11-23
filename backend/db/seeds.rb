puts "Cleaning database..."
RoutePoint.destroy_all
Route.destroy_all
Order.destroy_all
User.destroy_all
Client.destroy_all
Store.destroy_all
puts "Database cleaned."

puts "Creating Stores..."
store1 = Store.create!(
  name: "Loja - Shopping Iguatemi Bosque",
  address: "Shopping Iguatemi Bosque, Fortaleza, CE",
  latitude: -3.7563,
  longitude: -38.4847
)

store2 = Store.create!(
  name: "Loja - North Shopping Jóquei",
  address: "North Shopping Jóquei, Fortaleza, CE",
  latitude: -3.7419,
  longitude: -38.5000
)
puts "Stores available: #{Store.count}"

puts "Creating Users..."
admin_s1 = User.create!(
  email: "admin.loja1@example.com",
  password: "password",
  password_confirmation: "password",
  role: :admin,
  store: store1
)

entregador1_s1 = User.create!(
  email: "entregador1.loja1@example.com",
  password: "password",
  password_confirmation: "password",
  role: :delivery_person,
  store: store1
)

entregador2_s1 = User.create!(
  email: "entregador2.loja1@example.com",
  password: "password",
  password_confirmation: "password",
  role: :delivery_person,
  store: store1
)

admin_s2 = User.create!(
  email: "admin.loja2@example.com",
  password: "password",
  password_confirmation: "password",
  role: :admin,
  store: store2
)

entregador1_s2 = User.create!(
  email: "entregador1.s2@example.com",
  password: "password",
  password_confirmation: "password",
  role: :delivery_person,
  store: store2
)

User.create!(
  email: "admin@loja.com",
  password: "123456",
  password_confirmation: "123456",
  role: :admin,
  store: store1
)

demo_entregador = User.create!(
  email: "entregador@loja.com",
  password: "123456",
  password_confirmation: "123456",
  role: :delivery_person,
  store: store1
)
puts "Users created: #{User.count}"

puts "Creating Clients..."
client_data = [
  [ "Rua Major Facundo, 848, Fortaleza, CE", -3.7270, -38.5267 ],
  [ "Avenida Bezerra de Menezes, 2450, Fortaleza, CE", -3.7355, -38.5660 ],
  [ "Rua Araré, 1017, Caucaia, CE", -3.7365, -38.6532 ],
  [ "Rua Heribaldo Rodrigues, 358, Caucaia, CE", -3.7288, -38.6610 ],
  [ "Rua Tomás Rodrigues, 125, Fortaleza, CE", -3.7441, -38.5122 ],
  [ "Rua Professor Joaquim Nogueira, 283, Fortaleza, CE", -3.7498, -38.5261 ],
  [ "Rua Osvaldo Cruz, 1700, Fortaleza, CE", -3.7392, -38.4948 ],
  [ "Rua Dom Expedito Lopes, 1884, Fortaleza, CE", -3.7486, -38.5433 ],
  [ "Rua Bárbara de Alencar, 290, Fortaleza, CE", -3.7318, -38.5269 ],
  [ "Rua Monsenhor Bruno, 1380, Fortaleza, CE", -3.7350, -38.4895 ],
  [ "Rua Patriolino Aguiar, 119, Fortaleza, CE", -3.7304, -38.4972 ],
  [ "Rua Deputado João Lopes, 12, Fortaleza, CE", -3.7219, -38.5314 ],
  [ "Rua Floriano Peixoto, 356, Fortaleza, CE", -3.7248, -38.5261 ],
  [ "Avenida Dom Almeida Lustosa, 2788, Caucaia, CE", -3.7581, -38.6524 ],
  [ "Rua General Sampaio, 1630, Fortaleza, CE", -3.7326, -38.5318 ]
]

clients = client_data.map.with_index do |(address, latitude, longitude), index|
  Client.create!(
    name: "Cliente #{index + 1}",
    address: address,
    phone: "(85) 9#{rand(1000..9999)}-#{rand(1000..9999)}",
    latitude: latitude,
    longitude: longitude
  )
end
puts "Clients created: #{Client.count}"

puts "Creating Orders..."
Order.skip_callback(:create, :after, :enqueue_route_calculation)

possible_statuses = [ :pending, :in_route, :delivered, :canceled ]
all_stores = [ store1, store2 ]
all_delivery_people = [ demo_entregador, entregador1_s1, entregador2_s1, entregador1_s2 ]

clients.each do |client|
  store = all_stores.sample
  status = possible_statuses.sample
  delivery_person = (status == :delivered || status == :canceled) ? nil : all_delivery_people.sample
  is_late = status == :in_route && rand(10) < 3

  order = Order.create!(
    client: client,
    store: store,
    delivery_address: client.address,
    status: status,
    delivery_person: delivery_person,
    total: rand(50.0..500.0).round(2),
    is_late: is_late
  )

  route = Route.create!(
    store: order.store,
    order: order,
    origin_latitude: order.store.latitude,
    origin_longitude: order.store.longitude,
    destination_latitude: order.client.latitude,
    destination_longitude: order.client.longitude,
    travel_mode: "driving",
    distance: rand(1000..15000).to_f,
    duration: rand(10..60)
  )

  RoutePoint.create!(route: route, latitude: route.origin_latitude, longitude: route.origin_longitude, order: 0)
  mid_lat = (route.origin_latitude + route.destination_latitude) / 2
  mid_lon = (route.origin_longitude + route.destination_longitude) / 2
  RoutePoint.create!(route: route, latitude: mid_lat, longitude: mid_lon, order: 1)
  RoutePoint.create!(route: route, latitude: route.destination_latitude, longitude: route.destination_longitude, order: 2)
end

Order.set_callback(:create, :after, :enqueue_route_calculation)

puts "Orders created: #{Order.count}"
puts "Routes created: #{Route.count}"
puts "RoutePoints created: #{RoutePoint.count}"
puts "Seed data creation finished!"
puts
puts "Login de demonstração:"
puts "  Admin:      admin@loja.com / 123456"
puts "  Entregador: entregador@loja.com / 123456"
