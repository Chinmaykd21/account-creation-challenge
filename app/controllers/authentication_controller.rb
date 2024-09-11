class AuthenticationController < ApplicationController
  include JwtHelper

  # Skip authenticity token check since we are doing token-based authentication
  skip_before_action :verify_authenticity_token

  def verify_token
    token = request.headers['Authorization']&.split(" ")&.last

    if token.blank?
      render json: { valid: false, error: 'No token provided' }, status: :unauthorized
      return
    end

    begin
      decoded_token = decode_token(token)

      if decoded_token.present? && user_exists?(decoded_token)
        render json: { valid: true }, status: :ok
      else
        render json: { valid: false, error: 'Invalid or expired token' }, status: :unauthorized
      end
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT Decode Error: #{e.message}"
      render json: { valid: false, error: "Invalid token" }, status: :unauthorized
    end
  end
  
  private

  def user_exists?(decoded_token)
    username = decoded_token['username']
    User.exists?(username: username)
  end
end
