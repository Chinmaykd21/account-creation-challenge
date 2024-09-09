class User < ApplicationRecord
  # Note_To_Self: This is a Rail method that integrates bcrypt for password encryption.
  # It automatically provides methods like authenticate and ensures that psasword is hashed and store as
  # password_digest in the database.
  # When has_secure_password is set, Rail expects a password_digest column in database, which stores
  # hashed password. The raw password is still available in memory during validation, so it can be
  # validated before its encrypted
  has_secure_password

  validates :username, presence: true, uniqueness: true, length: { minimum: 10, maximum: 50 }
  validates :password, presence: true, length: { minimum: 20, maximum: 50 }
  
  # Custom validation for the password
  validate :validate_password

  def self.validate_username(username)
    return false if username.length < 10 || username.length > 50
    true
  end

  def self.validate_password(password)
    return false unless password.length.between?(20, 50)
    return false unless password.match?(/[a-zA-Z]/) && password.match?(/\d/)
    true
  end

  def validate_password
    return if password.blank?
    
    unless password.match?(/[a-zA-Z]/) && password.match?(/\d/)
      errors.add(:password,'must contain at least one letter and one number')
    end
  end
end
