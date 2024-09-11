# app/middleware/auth_user.rb
class AuthUser
  def initialize(app)
    @app = app
  end

  def call(env)
    # These paths are public paths
    public_paths = [
      '/', 
      '/api/create-account',
      '/api/verify-token',
      '/create-account',
      '/signup/account-selection',
      '/signup/create-user',
      '/signup/deposit',
      '/signup/joint-access',
      '/signup/stock-restrictions',
    ]

    request_path = env['PATH_INFO'].downcase
    puts "**** [middleware]: request_path #{request_path}"

    # All paths that do not require user to be authorized are handled here
    if public_paths.include?(request_path)
      puts "**** [Middleware]: Public paths resource request processing started at #{Time.now}"
      start_time = Time.now
      status, headers, response = @app.call(env)
      end_time = Time.now
      puts "**** [Middleware]: Public paths resource request processing ended at #{Time.now}"
      puts "**** [Middleware]: Public path resource request took #{end_time - start_time} seconds"
      return [status, headers, response]
    end

    # Future_Enhancement: All protected paths that requires user to be authorized
    # will be handled here
    puts "**** [Middleware]: Protected paths resource request processing started at #{Time.now}"
    start_time = Time.now
    status, headers, response = @app.call(env)
    end_time = Time.now
    puts "**** [Middleware]: Protected paths resource request processing ended at #{Time.now}"
    puts "**** [Middleware]: Protected path resource request took #{end_time - start_time} seconds"
    # puts "**** [Middleware]: Response body: #{response.body}" if response.respond_to?(:body)
    return [status, headers, response]
  end
end