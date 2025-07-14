class RouteSerializer < ActiveModel::Serializer
  attributes :id, :distance, :duration, :polyline

  # O polyline é armazenado como JSON string, então precisamos parseá-lo de volta para um array
  def polyline
    object.polyline ? JSON.parse(object.polyline) : []
  rescue JSON::ParserError
    []
  end
end