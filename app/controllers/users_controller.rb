class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create_account]
  
  def create_account
    username = params[:username]
    password = params[:password]
    honeypot = params[:honeypot] || ''

    # Validate honeypot field (should be empty)
    if honeypot.length != 0
      render json: { error: 'Bot detected. Submission will not be processed' }, status: :unprocessable_entity
      return
    end

    begin
      user = User.new(username: username, password: password)
      if user.save
        # TODO: Create a token and return it to the client
        render json: { message: 'User created successfully, redirecting', redirect_url: '/signup/account-selection' }, status: :ok
      else
        render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: `Unexpected error occurred: #{e.message}` }, status: :internal_server_error
    end
  end
end
