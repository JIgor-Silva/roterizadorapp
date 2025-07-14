class AddPolylineToRoutes < ActiveRecord::Migration[7.1]
  def change
    add_column :routes, :polyline, :text
  end
end