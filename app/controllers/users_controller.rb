class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create_account]
  
  def create_account
    ### This is where we will add logic to handle account creation
  end
end
