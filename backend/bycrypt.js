const bcrypt = require("bcrypt");

/**
 * Hash a password using bcrypt.
 * @param {string} password - The plain text of the password to hash.
 * @returns {Promise<string>} - returns the hashed password.
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    //console.time("bcrypt-hash");
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //console.timeEnd("bcrypt-hash");
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

// This function will run only if this file is run directly
if (require.main === module) {
  const passwords = [
    "abc", // small
    "A12",
    "Abc",
    "whz",
    "22?",
    "PaRty", // medium
    "C4r3",
    "taco",
    "Secret",
    "Aa23$?",
    "BigS3cret", // big
    "Bigsecret",
    "bigSecret",
    "bigsecret",
    "b!gsecr3t",
  ];

  console.log(
    "\x1b[32m\x1b[1m%s\x1b[0m", // Green text for the header
    "Plaintext".padEnd(15, " ") +
      "Hashing Time".padEnd(15, " ") +
      "Verify Time".padEnd(15, " ") +
      "Hashed Password".padEnd(60, " ")
  );

  (async () => {
    for (const password of passwords) {
      console.log(await analysis(password));
    }
  })();
}

module.exports = {
  hashPassword,
  verifyPassword,
};