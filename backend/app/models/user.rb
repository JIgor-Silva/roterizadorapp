class User < ApplicationRecord
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist

  belongs_to :store, optional: true
  has_many :orders
  enum :role, { delivery_person: 0, admin: 1 }, default: :delivery_person

  validates :email, uniqueness: true
  validates :store_id, presence: true, if: :delivery_person?
  has_many :orders_as_delivery_person, class_name: "Order", foreign_key: "delivery_person_id", dependent: :nullify
end
