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

  test "should not save user if password contains only numbers" do
    user = User.new(username: 'validvalid', password: '12345678901234567890')
    assert_not user.save, "Saved the user with a password containing only numbers"
    assert_includes user.errors[:password], "must contain at least one letter and one number"
  end

  test "should not save user if password contains only letters" do
    user = User.new(username: 'validvalid', password: 'Validpasswordvalid')
    assert_not user.save, "Saved the user with a password containing only letters"
    assert_includes user.errors[:password], "must contain at least one letter and one number"
  end

  test "should not save user with weak password (strength score < 2)" do
    user = User.new(username: 'validvalid', password: 'aaaaaaaaaaaaaaaaaaaa2')
    assert_not user.save, "Saved the user with a weak password"
    assert_includes user.errors[:password], "is too weak, please choose a stronger password"
  end

  test "should save user with a strong password" do
    user = User.new(username: 'validvalid', password: 'Validpassword12345go')  # Stronger password
    assert user.save, "Failed to save the user with a strong password"
  end

  test "should save user with valid password containing letters and numbers" do
    user = User.new(username: 'validvalid', password: 'Validpasswordvalid12')
    assert user.save, "Failed to save the user with a valid password containing letters and numbers"
  end
end
