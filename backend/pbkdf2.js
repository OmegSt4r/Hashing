const crypto = require("crypto");
const iterations = 96000; // Number of iterations

const hashPassword = (plaintext) => {
  const salt = crypto.randomBytes(16); // Generate a random salt
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

// A second hashPassword function that works with the current datbase implementation
const hashPassword2 = (plaintext) => {
  const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
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

function analysis(plaintext) {
  const startHashing = Date.now(); // Record the start time
  const { salt, hash } = hashPassword(plaintext); // Hash the plaintext
  const hashingTime = Date.now() - startHashing; // Calculate the elapsed time

  const startVerifying = Date.now(); // Record the start time
  const isCorrect = verify(salt, hash, plaintext);
  const verifyTime = Date.now() - startVerifying; // Calculate the elapsed time

  return (
    plaintext.padEnd(15, " ") + // Adjust padding as needed
    (hashingTime.toString() + "ms").padEnd(15, " ") +
    (verifyTime.toString() + "ms").padEnd(15, " ") +
    `sha512:${iterations}:${salt.toString("base64")}:${hash}`.padEnd(60, " ")
  );
}

// this function will run only if this file is run directly
// It will not run if this file is imported as a module
if (require.main === module) {
  const passwords = [
    "abc", //small
    "A12",
    "Abc",
    "whz",
    "22?",
    "PaRty", //medium
    "C4r3",
    "taco",
    "Secret",
    "Aa23$?",
    "BigS3cret", //big
    "Bigsecret",
    "bigSecret",
    "bigsecret",
    "b!gsecr3t",
  ];
  console.log(
    "\x1b[32m\x1b[1m%s\x1b[0m", //green
    "Plaintext".padEnd(15, " ") +
      "Hashing Time".padEnd(15, " ") +
      "Verify Time".padEnd(15, " ") +
      "Hash Cat Format".padEnd(60, " ")
  );
  for (password of passwords) {
    console.log(analysis(password));
  }
}

module.exports = {
  hashPassword2,
  verify,
};
