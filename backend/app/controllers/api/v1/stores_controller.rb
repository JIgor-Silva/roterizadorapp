# frozen_string_literal: true
class Api::V1::StoresController < Api::V1::ApplicationController
  before_action :set_store, only: [:show, :update]
  # GET /api/v1/stores/:id
  def show
    render json: @store, serializer: Api::V1::StoreSerializer
  end

  # PATCH/PUT /api/v1/stores/:id
  def update
    if @store.update(store_params)
      render json: @store, serializer: Api::V1::StoreSerializer
    else
      render json: { errors: @store.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_store
    @store = Store.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Loja não encontrada." }, status: :not_found
    nil 
  end

  # def authorize_store_access
  #   authorize @store
  # end

  def store_params
    params.require(:store).permit(:name, :address)
  end
end
