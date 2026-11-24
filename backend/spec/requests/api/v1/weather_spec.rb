# frozen_string_literal: true

require "rails_helper"

RSpec.describe "GET /api/v1/weather", type: :request do
  let(:store) { Store.create!(name: "Loja", address: "Rua A", latitude: -3.75, longitude: -38.48) }
  let(:user) { User.create!(email: "admin@example.com", password: "password", role: :admin, store: store) }
  let(:headers) { { "Authorization" => "Bearer #{Warden::JWTAuth::UserEncoder.new.call(user, :api_v1_user, nil).first}" } }
  let(:params) { { latitude: -3.75, longitude: -38.48 } }

  it "retorna 401 sem token" do
    get "/api/v1/weather", params: params
    expect(response).to have_http_status(:unauthorized)
  end

  it "retorna 400 sem latitude/longitude" do
    get "/api/v1/weather", headers: headers
    expect(response).to have_http_status(:bad_request)
    expect(JSON.parse(response.body)["error"]).to eq("Latitude e longitude são obrigatórias.")
  end

  it "retorna os dados do clima" do
    allow(WeatherService).to receive(:get_weather).and_return({ current: { "temp_c" => 30 } })
    get "/api/v1/weather", params: params, headers: headers
    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body).dig("current", "temp_c")).to eq(30)
  end

  it "retorna 502 quando o serviço falha" do
    allow(WeatherService).to receive(:get_weather).and_return({ error: "Serviço de clima indisponível." })
    get "/api/v1/weather", params: params, headers: headers
    expect(response).to have_http_status(:bad_gateway)
  end
end
