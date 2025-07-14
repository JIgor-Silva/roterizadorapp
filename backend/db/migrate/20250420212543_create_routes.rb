class CreateRoutes < ActiveRecord::Migration[8.0]
  def change
    create_table :routes do |t|
      t.references :store, null: false, foreign_key: true
      t.references :order, null: false, foreign_key: true
      t.float :origin_latitude
      t.float :origin_longitude
      t.float :destination_latitude
      t.float :destination_longitude
      t.string :travel_mode
      t.float :distance

      t.timestamps
    end
  end
end
