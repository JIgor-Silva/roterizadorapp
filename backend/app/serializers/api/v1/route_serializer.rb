# app/serializers/api/v1/route_serializer.rb
module Api
  module V1
    class RouteSerializer < ActiveModel::Serializer
      attributes :id,
                 :origin_latitude,
                 :origin_longitude,
                 :destination_latitude,
                 :destination_longitude,
                 :travel_mode,
                 :distance,
                 :duration,
                 :polyline

      has_many :route_points

      def polyline
        object.polyline ? JSON.parse(object.polyline) : []
      rescue JSON::ParserError
        []
      end
    end
  end
end
