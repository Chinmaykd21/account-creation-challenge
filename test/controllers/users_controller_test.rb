require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @valid_username = "validvalid"
    @valid_password = "validvalidvalid12345"
    @honeypot_empty = ""
  end

  test "should detect bot when honeypot field is filled" do
    post api_create_account_url, params: { username: @valid_username, password: @valid_password, honeypot: "bot" }
    
    assert_response :unprocessable_entity
    assert_equal 'Bot detected. Submission will not be processed', JSON.parse(response.body)['error']
  end

  test "should create account with valid data" do
    post api_create_account_url, params: { username: @valid_username, password: @valid_password, honeypot: @honeypot_empty }

    assert_response :ok
  end

  test "should not create an account on empty username" do
    post api_create_account_url, params: { username: '', password: @valid_password, honeypot: @honeypot_empty }

    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)['error'], "Username can't be blank"
  end

  test "should not create account with invalid password" do
    post api_create_account_path, params: { username: @valid_username, password: 'short123', honeypot: @honeypot_empty }

    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)['error'], "Password is too short (minimum is 20 characters)"
  end

  test "should not create account with invalid username" do
    post api_create_account_path, params: { username: 'short', password: @valid_password, honeypot: @honeypot_empty }

    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)['error'], "Username is too short (minimum is 10 characters)"
  end
end
