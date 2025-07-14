class RoutePoint < ApplicationRecord
  belongs_to :route

  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :order, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
