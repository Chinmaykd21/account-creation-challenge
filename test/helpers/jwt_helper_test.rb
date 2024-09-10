require "test_helper"
require 'jwt'

class JwtHelperTest < ActiveSupport::TestCase
  include JwtHelper
  def setup
    # Set the secret key for JWT manually
    ENV['JWT_SECRET'] = 'test_secret_key'
    @payload = { user_id: 1 }  # Sample payload
  end

  test "should encode token with valid payload" do
    token = encode_token(@payload)
    assert_not_nil token, "Token should not be nil after encoding"
  end

  test "should decode token with correct payload" do
    token = encode_token(@payload)
    decoded_token = decode_token(token)
    assert_equal @payload[:user_id], decoded_token["user_id"], "Decoded token should match the original payload"
  end

  test "should return nil for invalid token" do
    invalid_token = "invalid.token.value"
    assert_nil decode_token(invalid_token), "Invalid token should return nil"
  end
end