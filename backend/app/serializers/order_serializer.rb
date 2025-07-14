class OrderSerializer < ActiveModel::Serializer
  attributes :id, :status, :total, :is_late
  has_one :client
  has_one :store
  has_one :delivery_person
  has_one :route
end
