class Client < ApplicationRecord
  has_many :orders
  has_many :routes, through: :orders

  geocoded_by :address
  after_validation :geocode, if: ->(obj){ obj.address.present? && obj.address_changed? && obj.latitude.blank? && obj.longitude.blank? }
  
  validates :name, presence: true
  validates :address, presence: true
  validates :latitude, numericality: { allow_nil: true }
  validates :longitude, numericality: { allow_nil: true }
end
