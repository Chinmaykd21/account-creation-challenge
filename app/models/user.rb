require 'zxcvbn'

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

  # Custom password validation for user class instance
  validate :validate_password
  validate :validate_password_strength

  # An instance level method that Rails will run automatically
  def validate_password
    return if password.blank?

    unless password.match?(/[a-zA-Z]/) && password.match?(/\d/)
      errors.add(:password, 'must contain at least one letter and one number')
    end
  end

  # Password strength validation using zxcvbn (score should be >= 2)
  def validate_password_strength
    return if password.blank?

    strength = Zxcvbn.test(password)
    if strength.score < 2
      errors.add(:password, 'is too weak, please choose a stronger password')
    end
  end
end
