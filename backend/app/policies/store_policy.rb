# frozen_string_literal: true

class StorePolicy < ApplicationPolicy
  def show?
    user.admin? || record.id == user.store_id
  end

  def update?
    user.admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user.admin?
        scope.all
      else
        scope.where(id: user.store_id)
      end
    end
  end
end
