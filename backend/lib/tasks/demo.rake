# frozen_string_literal: true

namespace :demo do
  desc "Adiciona lojas, logins e pedidos de demonstração (não apaga dados)"
  task popular: :environment do
    abort("demo:popular não pode rodar em produção.") if Rails.env.production?

    senha = "demo123"

    lojas = [
      { chave: "riomar", name: "Loja - Shopping RioMar Fortaleza", address: "Rua Desembargador Lauro Nogueira, 1500, Papicu, Fortaleza, CE", latitude: -3.7354, longitude: -38.4643 },
      { chave: "parangaba", name: "Loja - Shopping Parangaba", address: "Rua Germano Frank, 300, Parangaba, Fortaleza, CE", latitude: -3.7748, longitude: -38.5626 },
      { chave: "messejana", name: "Loja - Shopping Messejana", address: "Avenida Frei Cirilo, 3840, Messejana, Fortaleza, CE", latitude: -3.8296, longitude: -38.4920 }
    ]

    pedidos = [
      { loja: "riomar", cliente: "Maria Souza", address: "Avenida Beira Mar, 3000, Meireles, Fortaleza, CE", latitude: -3.7253, longitude: -38.4935, status: :in_route, is_late: false, entregador: 1, total: 89.90 },
      { loja: "riomar", cliente: "João Lima", address: "Avenida Santos Dumont, 5335, Papicu, Fortaleza, CE", latitude: -3.7389, longitude: -38.4712, status: :in_route, is_late: true, entregador: 2, total: 45.50 },
      { loja: "riomar", cliente: "Ana Costa", address: "Rua Barão de Aracati, 1100, Aldeota, Fortaleza, CE", latitude: -3.7322, longitude: -38.5044, status: :pending, is_late: false, entregador: nil, total: 120.00 },
      { loja: "riomar", cliente: "Pedro Alves", address: "Avenida Washington Soares, 1321, Edson Queiroz, Fortaleza, CE", latitude: -3.7713, longitude: -38.4807, status: :delivered, is_late: false, entregador: 1, total: 64.00 },
      { loja: "parangaba", cliente: "Carla Mendes", address: "Avenida Godofredo Maciel, 2000, Maraponga, Fortaleza, CE", latitude: -3.7915, longitude: -38.5663, status: :in_route, is_late: false, entregador: 1, total: 37.80 },
      { loja: "parangaba", cliente: "Lucas Rocha", address: "Avenida José Bastos, 2000, Damas, Fortaleza, CE", latitude: -3.7556, longitude: -38.5418, status: :in_route, is_late: true, entregador: 2, total: 150.00 },
      { loja: "parangaba", cliente: "Fernanda Dias", address: "Avenida Augusto dos Anjos, 1500, Bonsucesso, Fortaleza, CE", latitude: -3.7826, longitude: -38.5897, status: :pending, is_late: false, entregador: nil, total: 72.30 },
      { loja: "parangaba", cliente: "Rafael Nunes", address: "Avenida Bezerra de Menezes, 1000, São Gerardo, Fortaleza, CE", latitude: -3.7334, longitude: -38.5452, status: :canceled, is_late: false, entregador: nil, total: 25.00 },
      { loja: "messejana", cliente: "Juliana Freitas", address: "Rua Padre Valdevino, 1500, Joaquim Távora, Fortaleza, CE", latitude: -3.7406, longitude: -38.5147, status: :in_route, is_late: false, entregador: 1, total: 58.40 },
      { loja: "messejana", cliente: "Bruno Teixeira", address: "Rua Júlio Siqueira, 800, Dionísio Torres, Fortaleza, CE", latitude: -3.7451, longitude: -38.5003, status: :in_route, is_late: false, entregador: 2, total: 99.99 },
      { loja: "messejana", cliente: "Patrícia Gomes", address: "Avenida Oliveira Paiva, 1500, Cidade dos Funcionários, Fortaleza, CE", latitude: -3.7920, longitude: -38.4930, status: :delivered, is_late: false, entregador: 2, total: 41.20 },
      { loja: "messejana", cliente: "Diego Barros", address: "Rua 24 de Maio, 500, Centro, Fortaleza, CE", latitude: -3.7297, longitude: -38.5296, status: :in_route, is_late: true, entregador: 1, total: 33.00 }
    ]

    entregadores = {}

    ActiveRecord::Base.transaction do
      stores = {}

      lojas.each do |l|
        store = Store.find_or_create_by!(name: l[:name]) { |s| s.address = l[:address]; s.latitude = l[:latitude]; s.longitude = l[:longitude] }
        stores[l[:chave]] = store
      end

      lojas.each do |l|
        store = stores[l[:chave]]

        email_admin = "admin.#{l[:chave]}@demo.com"
        user_admin = User.find_or_initialize_by(email: email_admin)
        user_admin.role = :admin
        user_admin.store = store
        user_admin.password = senha
        user_admin.password_confirmation = senha
        user_admin.save!

        entregadores[[ l[:chave], 1 ]] = User.find_or_initialize_by(email: "entregador1.#{l[:chave]}@demo.com")
        entregadores[[ l[:chave], 1 ]].role = :delivery_person
        entregadores[[ l[:chave], 1 ]].store = store
        entregadores[[ l[:chave], 1 ]].password = senha
        entregadores[[ l[:chave], 1 ]].password_confirmation = senha
        entregadores[[ l[:chave], 1 ]].save!

        entregadores[[ l[:chave], 2 ]] = User.find_or_initialize_by(email: "entregador2.#{l[:chave]}@demo.com")
        entregadores[[ l[:chave], 2 ]].role = :delivery_person
        entregadores[[ l[:chave], 2 ]].store = store
        entregadores[[ l[:chave], 2 ]].password = senha
        entregadores[[ l[:chave], 2 ]].password_confirmation = senha
        entregadores[[ l[:chave], 2 ]].save!
      end

      pedidos.each_with_index do |p, index|
        store = stores[p[:loja]]
        client = Client.find_or_create_by!(name: p[:cliente], address: p[:address]) { |c| c.latitude = p[:latitude]; c.longitude = p[:longitude]; c.phone = format("(85) 98800-%04d", index + 1) }

        order = Order.find_or_create_by!(client: client, store: store) { |o| o.status = p[:status]; o.is_late = p[:is_late]; o.total = p[:total]; o.delivery_address = p[:address]; o.delivery_person = p[:entregador] && entregadores[[ p[:loja], p[:entregador] ]] }

        Route.create!(order: order, store: store, origin_latitude: store.latitude, origin_longitude: store.longitude, destination_latitude: client.latitude, destination_longitude: client.longitude, travel_mode: :driving) unless order.route
      end
    end

    puts "Dados de demonstração prontos (senha de todos os logins: demo123):"
    lojas.each do |l|
      puts "  #{l[:name]}: admin.#{l[:chave]}@demo.com | entregador1.#{l[:chave]}@demo.com | entregador2.#{l[:chave]}@demo.com"
    end
    puts "  Pedidos de demonstração: #{pedidos.size}"
  end
end
