# app/middleware/auth_user.rb
class AuthUser
  SECRET_KEY = ENV["JWT_SECRET_KEY"]

  def initialize(app)
    @app = app
  end

  def call(env)
    # These paths are public paths
    skip_paths = ['/create-account', '/api/create-account']

    request_path = env['PATH_INFO'].downcase
    puts "**** [middleware]: request_path #{request_path}"

    if skip_paths.include?(request_path)
      puts "**** [middleware]: skipping path"
      return @app.call(env)
    end

    puts "**** [Middleware]: Processing request at #{Time.now}"
    start_time = Time.now
    
    token = extract_token(env)

    if token & valid_token?(token)
      status, headers, response = @app.call(env)
      end_time = Time.now
      
      [status, headers, response]
      puts "**** [Middleware]: Request took #{end_time - start_time} seconds"
      puts "**** [Middleware]: Response body: #{response.body}" if response.respond_to?(:body)
    else
      puts "**** [Middleware]: Processing failed #{Time.now}"
      return [401, { 'Content-Type' => 'application/json' }, [{
        error: 'Unauthorized: Invalid or missing token',
        redirect_url: '/create-account'
      }.to_json]]
    end
  end
  
  private

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

  def valid_token?(token)
    decoded_token = decode_token(token)
    decoded_token && decoded_token['username']
    puts "**** [middleware]: decoded token #{decoded_token}"
  rescue JWT::ExpiredSignature, JWT::DecodeError
    false
  end

  def extract_token(env)
    auth_header = env['HTTP_AUTHORIZATION']
    return nil unless auth_header
    puts "**** [middleware]: auth header #{auth_header}"
    # Assuming the header format is bearer token
    auth_header.split(' ').last
  end
end