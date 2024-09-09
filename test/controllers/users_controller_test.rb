require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  # Test case 1: Bot detection (honeypot field has a value)
  test "should detect bot when honeypot field is filled" do
    post api_create_account_url, params: { username: "validvalid", password: "validvalidvalid12345", honeypot: "bot" }
    
    assert_response :unprocessable_entity
    assert_equal 'Bot detected. Submission will not be processed', JSON.parse(response.body)['error']
  end
end
