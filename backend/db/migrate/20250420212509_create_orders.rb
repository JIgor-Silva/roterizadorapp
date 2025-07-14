class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.references :client, null: false, foreign_key: true
      t.references :store, null: false, foreign_key: true
      t.string :delivery_address

      t.timestamps
    end
  end
end
