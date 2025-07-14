class AddStatusToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :status, :integer, default: 0 # 0: pendente, 1: em rota, 2: entregue
    add_index :orders, :status
  end
end
