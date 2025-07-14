# config/initializers/geocoder.rb
Geocoder.configure(
  # AUMENTE O TEMPO LIMITE AQUI
  timeout: 15,

  # set to true to use HTTPS for geocoding API calls. default is false.
  :use_https => true,

  # set to true to use an API key for geocoding service (default is false):
  :api_key => Rails.application.credentials.google_geocoding_api_key, # Assumindo que você configurou esta chave

  # language to use for geocoding API calls (default is nil):
  :language => :pt,

  # region to use for geocoding API calls (default is nil):
  :region => :br
)
