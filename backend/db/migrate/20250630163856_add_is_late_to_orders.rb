class AddIsLateToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :is_late, :boolean
  end
end
