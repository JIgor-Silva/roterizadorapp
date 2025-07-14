module Api
  module V1
    class RoutePointSerializer < ActiveModel::Serializer
      attributes :id, :latitude, :longitude, :order
    end
  end
end
