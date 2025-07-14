# app/serializers/api/v1/store_serializer.rb
module Api
  module V1
    class StoreSerializer < ActiveModel::Serializer
      attributes :id, :name, :address
    end
  end
end
