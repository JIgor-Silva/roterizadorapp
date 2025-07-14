# db/migrate/20250529163708_add_store_to_users.rb
class AddStoreToUsers < ActiveRecord::Migration[8.0]
  def change
    add_reference :users, :store, null: true, foreign_key: true
  end
end
