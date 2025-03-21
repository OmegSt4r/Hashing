const bcrypt = require("bcrypt");

/**
 * Hash a password using bcrypt.
 * @param {string} password - The plain text of the password to hash.
 * @returns {Promise<string>} - returns the hashed password.
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    console.time("bcrypt-hash");
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.timeEnd("bcrypt-hash");
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password with bcrypt:", error);
    throw error;
  }
};

/**
 * Verify a password against a hashed password.
 * @param {string} password - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password with bcrypt:", error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
};