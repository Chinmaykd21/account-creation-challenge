require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "should not save user without username" do
    user = User.new(password: '123')
    assert_not user.save, "Saved the user without a username"
  end

  test "should not save user without password" do
    user = User.new(username: '123')
    assert_not user.save, "Saved the user without a password"
  end

  test "should save user" do
    user = User.new(username: 'validvalid', password: 'validvalidvalid12345')
    assert user.save, "Failed to save the user with a valid username and password"
  end

  # Test case: Should fail if password contains only numbers
  test "should not save user if password contains only numbers" do
    user = User.new(username: 'validvalid', password: '12345678901234567890')
    assert_not user.save, "Saved the user with a password containing only numbers"
    assert_includes user.errors[:password], "must contain at least one letter and one number"
  end

  # Test case: Should fail if password contains only letters
  test "should not save user if password contains only letters" do
    user = User.new(username: 'validvalid', password: 'Validpasswordvalid')
    assert_not user.save, "Saved the user with a password containing only letters"
    assert_includes user.errors[:password], "must contain at least one letter and one number"
  end

  # Test case: Should pass with a valid password containing both letters and numbers
  test "should save user with valid password containing letters and numbers" do
    user = User.new(username: 'validvalid', password: 'Validpasswordvalid12')
    assert user.save, "Failed to save the user with a valid password containing letters and numbers"
  end
end
