const crypto = require("crypto");
const iterations = 96000; // Number of iterations

const hashPassword = (plaintext) => {
  const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
  const keyLength = 64; // Desired key length
  const digest = "sha512"; // Hash function to use

  // Derive a hash using PBKDF2
  const hash = crypto
    .pbkdf2Sync(plaintext, salt, iterations, keyLength, digest)
    .toString("base64");

  return {
    salt,
    hash,
  };
};

const verify = (salt, hash, plaintext) => {
  const keyLength = 64; // Desired key length
  const digest = "sha512"; // Hash function to use

  // Derive a hash using the provided salt
  const derivedHash = crypto
    .pbkdf2Sync(plaintext, salt, iterations, keyLength, digest)
    .toString("base64");

  return derivedHash === hash;
};

// this function will run only if this file is run directly
// It will not run if this file is imported as a module
if (require.main === module) {
  const plaintext = "examplePassword123";

  console.log("\x1b[32m\x1b[1m%s\x1b[0m", "\nTime analysis"); // prints in green color

  console.time("hashing"); // starts the timer
  const { salt, hash } = hashPassword(plaintext); // Encrypt the plaintext
  console.timeEnd("hashing"); // prints time to encrypt

  console.time("verifying");
  const isCorrect = verify(salt, hash, plaintext); // Decrypt the encrypted text
  console.timeEnd("verifying");

  // prints the original text and the decrypted text
  console.log("\x1b[32m\x1b[1m%s\x1b[0m", "\nHashing analysis");
  console.log("Original text:", plaintext);
  console.log("Hashed text:", hash);
  console.log("Is Password Correct: ", isCorrect);
  //console.log("Decrypted text:", decryptedText);

  console.log("\x1b[32m\x1b[1m%s\x1b[0m", "\nFor Hash Cat");
  console.log(`sha512:${iterations}:${salt}:${hash}`);
}

module.exports = {
  hashPassword,
  verify,
};
