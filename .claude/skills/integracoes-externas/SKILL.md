---
name: integracoes-externas
description: Trabalhar com as integrações externas do backend — OpenRouteService (cálculo de rota), WeatherAPI (clima) e Geocoder/Nominatim (endereço → coordenadas). Use ao depurar rotas/polylines erradas, falhas de geocodificação, erros de chave de API ou ao criar um novo serviço HTTP.
---

# Integrações externas

| Serviço | Arquivo | Entrada → Saída |
|---------|---------|-----------------|
| OpenRouteService | `backend/app/services/route_calculation_service.rb` | `calculate_route([lat,lng], [lat,lng])` → `{distance: m, duration: s, geometry: [[lng,lat],...]}` ou `{error:}` |
| WeatherAPI | `backend/app/services/weather_service.rb` | `get_weather(lat, lng)` → `{current, location, forecast}` |
| Geocoder (Nominatim) | `config/initializers/geocoder.rb` + `geocoded_by` em Store/Client | endereço → `latitude/longitude` |

## Armadilhas conhecidas
- **Ordem das coordenadas**: app = `[lat, lng]`; ORS/GeoJSON = `[lng, lat]`. Bug clássico = rota no oceano. Inverta só na fronteira.
- `geocode_address` é chamado pelo `OrdersController` mas **não existe** no serviço (backlog #2). Implementação sugerida:
  ```ruby
  def self.geocode_address(address)
    result = Geocoder.search(address).first
    result ? [ result.latitude, result.longitude ] : nil
  rescue StandardError => e
    Rails.logger.error("Geocoding falhou: #{e.message}")
    nil
  end
  ```
- `API_KEY` é constante lida no boot → mudou credencial, reinicie o servidor.
- Nominatim: 1 requisição/segundo e exige User-Agent (já configurado). Em lote, use `sleep 1` (ver `lib/tasks/geocoding.rake`).
- WeatherService usa `http://` e não trata falha de rede/JSON — envolva em `rescue Faraday::Error, JSON::ParserError` e retorne `{ error: }`.
- `AppConfig.use_route_service_mock` (env `USE_ROUTE_SERVICE_MOCK=true`) existe mas não é usado — pode virar o switch para mock em dev sem chave.

## Depurar sem gastar cota
```bash
cd backend
bin/rails runner 'p RouteCalculationService.calculate_route([-3.7563,-38.4847],[-3.7419,-38.5000])'
bin/rails runner 'p Geocoder.search("North Shopping Jóquei, Fortaleza, CE").first&.coordinates'
bundle exec rake geocoding:process_addresses
```
(Fazem chamadas reais — avise o usuário antes de rodar em loop.)

## Novo serviço HTTP — padrão
- `app/services/<nome>_service.rb`, métodos de classe, HTTPS, `timeout:`, chave em `credentials.dig(:nome, :api_key)`.
- Nunca levantar para o controller: retornar `{ error: "mensagem pt-BR" }` + `Rails.logger.error`.
- Stub no `spec/support/` para os testes + spec próprio que stuba o cliente HTTP (HTTParty/Faraday), não o serviço.
- Documente a credencial nova no `CLAUDE.md` e `backend/README.md`.
