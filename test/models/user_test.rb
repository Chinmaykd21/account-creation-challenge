require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "should not save user without username" do
    user = User.new(password: '123')
    assert_not user.save
  end

  test "should not save user without password" do
    user = User.new(username: '123')
    assert_not user.save
  end

  test "should save user" do
    user = User.new(username: 'validvalid', password: 'validvalidvalid12345')
    assert user.save
  end

  test "should validate username" do
    assert_not User.validate_username('123456789'), "< 10"
    assert User.validate_username('1234567890'), ">= 10"
    assert User.validate_username('12345678901234567890123456789012345678901234567890'), "<= 50"
    assert_not User.validate_username('123456789012345678901234567890123456789012345678901'), "> 50"
  end

  test "should validate password" do
    assert_not User.validate_password('123456789012345678a'), "< 20"
    assert User.validate_password('1234567890123456789a'), ">= 20"
    assert User.validate_password('1234567890123456789012345678901234567890123456789a'), "<= 50"
    assert_not User.validate_password('123456789012345678901234567890123456789012345678901a'), "> 50"
  end
end
