module Api
  module V1
    class ClientSerializer < ActiveModel::Serializer
      attributes :id, :name, :address
    end
  end
end
