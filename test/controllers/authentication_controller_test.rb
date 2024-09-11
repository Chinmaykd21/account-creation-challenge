require "test_helper"

class AuthenticationControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create!(username: "validUser23", password: "validvalid23Password123")
    
    @controller = AuthenticationController.new
    @valid_token = @controller.encode_token({ username: @user.username })
    @invalid_token = "invalid-token"
  end

  test "should return unauthorized if token is empty" do
    post api_verify_token_url, headers: { Authorization: nil }

    assert_response :unauthorized
    response_body = JSON.parse(response.body)
    assert_equal false, response_body['valid']
    assert_equal 'No token provided', response_body['error']
  end

  test "should return valid true for a valid token" do
    post api_verify_token_url, headers: { Authorization: "Bearer #{@valid_token}" }

    assert_response :ok
    response_body = JSON.parse(response.body)
    assert_equal true, response_body['valid']
  end

  test "should return valid false for a invalid token" do
    post api_verify_token_url, headers: { Authorization: "Bearer #{@invalid_token}" }

    assert_response :unauthorized
    response_body = JSON.parse(response.body)
    assert_equal false, response_body['valid']
    assert_equal 'Invalid or expired token', response_body['error']
  end

  test "should return invalid token for non-existent user" do
    @non_existent_user_token = @controller.encode_token({ username: "non-existent-username" })
    post api_verify_token_url, headers: { Authorization: "Bearer #{@non_existent_user_token}" }

    assert_response :unauthorized
    response_body = JSON.parse(response.body)
    assert_equal false, response_body['valid']
    assert_equal 'Invalid or expired token', response_body['error']
  end
end
