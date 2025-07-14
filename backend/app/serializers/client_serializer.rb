# app/serializers/client_serializer.rb
class ClientSerializer < ActiveModel::Serializer
  attributes :id, :name, :address, :latitude, :longitude
end
