class Order < ApplicationRecord
  belongs_to :client
  belongs_to :store
  has_one :route
  belongs_to :delivery_person, class_name: "User", foreign_key: "delivery_person_id", optional: true

  attribute :delivery_address, :string
  enum :status, { pending: 0, in_route: 1, delivered: 2, canceled: 3 }

  after_create :enqueue_route_calculation

  private

  def enqueue_route_calculation
    CalculateRouteJob.perform_later(id)
  end
end
