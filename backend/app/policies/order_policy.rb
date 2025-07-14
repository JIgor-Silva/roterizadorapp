# app/policies/order_policy.rb
class OrderPolicy < ApplicationPolicy
  def index?
    user.admin?
  end

  def show?
    user.admin? || record.store_id == user.store_id
  end

  def create?
    user.admin?
  end

  def update?
    user.admin? || record.store_id == user.store_id
  end

  def route_details?
    show?
  end

  def calculate_route?
      user.admin? || record.store_id == user.store_id
  end

  def update_status_and_delivery_person?
    user.admin?
  end

  def update_status?
    update?
  end

  def route_details?
    show?
  end

  def calculate_route?
      user.admin? || record.store_id == user.store_id
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all.includes(:client, :store)
      elsif user.delivery_person?
        scope.where(delivery_person_id: user.id, store_id: user.store_id).includes(:client, :store)
      else
        scope.none
      end
    end
  end
end
