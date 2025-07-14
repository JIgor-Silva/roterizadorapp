class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :role, :store_id, :store_name

  def store_name
    object.store&.name
  end
end