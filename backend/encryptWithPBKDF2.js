const crypto = require("crypto");

//password is the key to encrypt the plaintext
//plaintext is the password to be encrypted
const encryptWithPBKDF2 = (password, plaintext) => {
  const salt = crypto.randomBytes(16); // Generate a random salt
  const iterations = 100000; // Number of iterations
  const keyLength = 32; // Desired key length
  const digest = "sha256"; // Hash function to use

  // Derive a key using PBKDF2
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    keyLength,
    digest
  );

  console.log("Derived key:", derivedKey.toString("hex"));

  // Now use the derived key for encryption (AES-256-CBC example)
  //iv ensures that the same plaintext encrypted with the same key will produce different ciphertexts
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);

  // Encrypt the plaintext
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  console.log("Encrypted text:", encrypted);
  console.log("Initialization vector (IV):", iv.toString("hex"));

  return {
    encryptedText: encrypted,
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
  };
};

const decryptWithPBKDF2 = (password, encryptedText, ivHex, saltHex) => {
  const salt = Buffer.from(saltHex, "hex"); // Convert salt back to buffer
  const iv = Buffer.from(ivHex, "hex"); // Convert IV back to buffer
  const iterations = 100000; // Number of iterations
  const keyLength = 32; // Desired key length
  const digest = "sha256"; // Hash function to use

  // Derive the same key using PBKDF2
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    keyLength,
    digest
  );

  console.log("Derived key for decryption:", derivedKey.toString("hex"));

  // Now use the derived key for decryption (AES-256-CBC example)
  const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);

  // Decrypt the encrypted text
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = {
  encryptWithPBKDF2,
};

// this function will run only if this file is run directly
// It will not run if this file is imported as a module
if (require.main === module) {
  const password = "mySecretPassword";
  const plaintext = "my secret message!";

  // Encrypt the plaintext
  const { encryptedText, iv, salt } = encryptWithPBKDF2(password, plaintext);

  // Decrypt the encrypted text
  const decryptedText = decryptWithPBKDF2(password, encryptedText, iv, salt);

  console.log("Original text:", plaintext);
  console.log("Decrypted text:", decryptedText);
}