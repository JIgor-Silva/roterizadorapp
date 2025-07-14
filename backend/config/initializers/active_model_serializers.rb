# config/initializers/active_model_serializers.rb
Rails.application.reloader.to_prepare do
  ActiveModelSerializers.config.adapter = :json
  ActiveModelSerializers.config.key_transform = :unaltered
  ActiveModelSerializers.config.adapter = :attributes
end
