Geocoder.configure(
  lookup: :nominatim,
  timeout: 15,
  use_https: true,
  language: :pt,
  http_headers: { "User-Agent" => "RoterizadorApp/1.0 (local development)" }
)
