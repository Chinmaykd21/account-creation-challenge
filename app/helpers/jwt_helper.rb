module JwtHelper

  # TODO: Move secret key to the environment variable after its working
  SECRET_KEY = ENV["JWT_SECRET_KEY"]

  def encode_token(payload)
    JWT.encode(payload, SECRET_KEY) 
  end

  def decode_token(token)
    begin
      decoded_token = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
      decoded_token[0]
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT Decode Error: #{e.message}"
      nil
    end
  end

  def create_token_for_user(user)
    { username: user.username, exp: Time.now.to_i + 3600 }
  end
end
