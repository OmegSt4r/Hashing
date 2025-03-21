const express = require("express");
const router = express.Router();
const db = require("./db");
const pbkdf2 = require("./pbkdf2-encryption");
const bycrypt = require("./bycrypt");
const argon2 = require("./argon2");
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password, email, encryption_type } = req.body;
  let hashedPassword;
  let iv = null;
  let salt = null;

  switch (encryption_type) {
    case "bcrypt":
      hashedPassword = await bycrypt.hashPassword(password);
      console.log("You picked bcrypt!");
      console.log(password, ": ", hashedPassword);
      break;
    case "pbkdf2":
      // using the password as the key to encrypt the password, lol am i doing this right?
      ({
        encryptedText: hashedPassword,
        iv: iv,
        salt: salt,
      } = pbkdf2.encrypt(password, password));
      console.log("you picked PBKDF2!");
      console.log(password, ": ", hashedPassword);
      break;
    case "argon2":
      hashedPassword = await argon2.hashPassword(password);
      console.log("You picked Argon2!");
      console.log(password, ": ", hashedPassword);
      break;
    default:
      console.log("Invalid choice!");
      break;
  }

  try {
    const msg = await insertUserData(
      username,
      hashedPassword,
      email,
      encryption_type,
      iv,
      salt
    );
    console.log(msg);
    res.status(201).json(msg);
  } catch (error) {
    console.error("Error inserting user data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const insertUserData = (
  username,
  hashedPassword,
  email,
  encryptionType,
  iv,
  salt
) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (username) VALUES (?)";
    db.query(sql, [username], (err, result) => {
      if (err) {
        console.error("Error inserting into users table:", err);
        return reject({
          message: "Error inserting into users table",
          success: false,
        });
      }

      const userId = result.insertId;

      const sqlInfo =
        "INSERT INTO user_info (user_id, u_password, email, p_encryption_type) VALUES (?, ?, ?, ?)";
      db.query(
        sqlInfo,
        [userId, hashedPassword, email, encryptionType],
        (err) => {
          if (err) {
            console.error("Error inserting into user_info table:", err);
            return reject({
              message: "Error inserting into user_info table",
              success: false,
            });
          }

          const sqlSecurity =
            "INSERT INTO security_data (user_id, iv, salt) VALUES (?, UNHEX(?), UNHEX(?))";
          db.query(sqlSecurity, [userId, iv, salt], (err) => {
            if (err) {
              console.error("Error inserting into security_data table:", err);
              return reject({
                message: "Error inserting into security_data table",
                success: false,
              });
            }

            console.log("User data inserted successfully");
            resolve({
              message: "User data inserted successfully",
              success: true,
            });
          });
        }
      );
    });
  });
};

// User login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT u.user_id, u.username, ui.u_password, ui.email, ui.p_encryption_type, sd.iv, sd.salt
    FROM users u
    JOIN user_info ui ON u.user_id = ui.user_id
    LEFT JOIN security_data sd ON u.user_id = sd.user_id
    WHERE u.username = ?
  `;

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    const encryption_type = user.p_encryption_type;
    const storedPassword = user.u_password;

    switch (encryption_type) {
      case "bcrypt":
        isPasswordValid = await bycrypt.verifyPassword(
          password,
          storedPassword
        );
        if (!isPasswordValidBcrypt) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        break;
      case "pbkdf2":
        const isPasswordValidPbkdf2 = await pbkdf2.verify(
          password,
          storedPassword,
          user.iv,
          user.salt
        );
        if (!isPasswordValidPbkdf2) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        break;
      case "argon2":
        // Implement Argon2 verification
        console.log("Argon2 verification not implemented yet");
        return res.status(500).json({ error: "Server error" });
      default:
        return res.status(400).json({ error: "Invalid encryption type" });
    }

    // Successful login
    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bycrypt.hashPassword(newPassword);

    const sql = "UPDATE user_info SET u_password = ? WHERE email = ?";
    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Password reset successfully" });
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
