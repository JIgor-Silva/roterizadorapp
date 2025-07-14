# app/serializers/api/v1/order_serializer.rb

module Api
  module V1
    class OrderSerializer < ActiveModel::Serializer
      attributes :id, :delivery_address, :created_at, :updated_at, :total, :coordinates, :customer_name, :customer_phone, :estimated_delivery, :is_late, :distance, :status

      def status
        object.status.to_s
      end

      belongs_to :client
      belongs_to :store
      belongs_to :delivery_person
      has_one :route

      def total
        object.total || 0.0
      end

      def coordinates
        { latitude: object.route&.destination_latitude, longitude: object.route&.destination_longitude }
      end

      def customer_name
        object.client&.name
      end

      def customer_phone
        object.client&.phone || "N/A"
      end

      def estimated_delivery
        if object.route&.duration
          (object.created_at + object.route.duration.minutes).strftime('%H:%M')
        else
          "N/A"
        end
      end

      def distance
        object.route&.distance
      end
    end
  end
end
