class Route < ApplicationRecord
  belongs_to :store
  belongs_to :order, optional: true
  has_many :route_points, dependent: :destroy

  validates :origin_latitude, presence: true
  validates :origin_longitude, presence: true
  validates :destination_latitude, presence: true
  validates :destination_longitude, presence: true
  validates :travel_mode, presence: true

  enum :travel_mode, { driving: "driving", walking: "walking", bicycling: "bicycling", transit: "transit" }

  attribute :distance, :float
end
