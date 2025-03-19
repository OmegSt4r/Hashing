const argon2 = require("argon2");

// Hash a password using Argon2
const hashPassword = async (password) => {
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id, // Recommended variant
      memoryCost: 2 ** 16, // 64MB RAM usage
      timeCost: 3, // Iterations
      parallelism: 1, // Number of threads
    });
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

// Verify if a given password matches the stored Argon2 hash
const verifyPassword = async (password, storedHash) => {
  try {
    const match = await argon2.verify(storedHash, password);
    return match;
  } catch (err) {
    console.error("Error verifying password:", err);
    throw err;
  }
};

// Run if executed directly (not imported as a module)
if (require.main === module) {
  (async () => {
    const password = "mySecretPassword";

    console.log("\x1b[32m\x1b[1m%s\x1b[0m", "\nTime analysis");

    console.time("Hashing");
    const hashedPassword = await hashPassword(password);
    console.timeEnd("Hashing");

    console.time("Verification");
    const isMatch = await verifyPassword(password, hashedPassword);
    console.timeEnd("Verification");

    console.log("\x1b[32m\x1b[1m%s\x1b[0m", "\nArgon2 Hashing Analysis");
    console.log("Original Password:", password);
    console.log("Hashed Password:", hashedPassword);
    console.log("Password Match:", isMatch ? "✅ Matched" : "❌ Not Matched");
  })();
}

module.exports = { hashPassword, verifyPassword };
