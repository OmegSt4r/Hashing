const express = require("express");
const router = express.Router();
const db = require("./db");
const pbkdf2 = require("./pbkdf2-encryption");
const bcrypt = require("bcrypt");
const argon2 = require("./argon2");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

// Define your credentials using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Optional if 3306 is the default port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Register a new user
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password, email, encryption_type } = req.body;
  let hashedPassword;
  let iv = null;
  let salt = null;

  switch (encryption_type) {
    case "bcrypt":
      hashedPassword = await bcrypt.hash(password, 10);
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
  res.status(201).json({ message: "Request data logged successfully" });
  insertUserData(username, hashedPassword, email, encryption_type, iv, salt);
});

// Function to insert user data into the database
const insertUserData = async (
  username,
  password,
  email,
  encryptionType,
  iv,
  salt
) => {
  const connection = await mysql.createConnection({
    ...dbConfig,
    authPlugins: {
      sha256_password: () => (data, cb) => {
        cb(null, Buffer.from(dbConfig.password));
      },
    },
  });

  try {
    await connection.connect();
    console.log("Connected to the database");

    // Start transaction
    await connection.beginTransaction();

    // Insert user into `users` table
    const [userResults] = await connection.execute(
      "INSERT INTO users (username) VALUES (?)",
      [username]
    );
    const userId = userResults.insertId;

    // Insert user info into `user_info` table
    await connection.execute(
      "INSERT INTO user_info (user_id, u_password, email, p_encryption_type) VALUES (?, ?, ?, ?)",
      [userId, password, email, encryptionType]
    );

    // Insert security data into `security_data` table
    await connection.execute(
      "INSERT INTO security_data (user_id, iv, salt) VALUES (?, UNHEX(?), UNHEX(?))",
      [userId, iv, salt]
    );

    // Commit transaction
    await connection.commit();
    console.log("User data inserted successfully");
  } catch (err) {
    console.error("Error during transaction:", err);

    // Rollback transaction on error
    if (connection && connection.rollback) {
      await connection.rollback();
    }
  } finally {
    if (connection && connection.end) {
      await connection.end();
    }
  }
};

router.post("/register2", async (req, res) => {
  try {
    const { username, password, email, encryption_type } = req.body;
    let hashedPassword;
    let iv = null;
    let salt = null;

    switch (encryption_type) {
      case "bcrypt":
        hashedPassword = await bcrypt.hash(password, 10);
        console.log("You picked bcrypt!");
        break;
      case "pbkdf2":
        // using the password as the key to encrypt the password, lol am i doing this right?
        ({ hashedPassword, iv, salt } = await pbkdf2.encrypt(
          password,
          password
        ));
        console.log("you picked PBKDF2!");
        break;
      case "argon2":
        const hashedPassword = argon2.hashPassword(password);
        console.log("You picked Argon2!");
        break;
      default:
        console.log("Invalid choice!");
        break;
    }

    const sql = "INSERT INTO users (username) VALUES (?)";
    db.query(sql, [username], (err, result) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const userId = result.insertId;
      const sqlInfo =
        "INSERT INTO user_info (user_id, u_password, email, p_encryption_type) VALUES (?, ?, ?, ?)";
      db.query(
        sqlInfo,
        [userId, hashedPassword, email, encryption_type],
        (err) => {
          if (err) {
            console.error("Error registering user info:", err);
            return res.status(500).json({ error: "Database error" });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT u.user_id, u.username, ui.u_password, ui.email, ui.wallet_balance 
    FROM users u 
    JOIN user_info ui ON u.user_id = ui.user_id 
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
        const isPasswordValidBcrypt = await bcrypt.compare(
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
        //wallet_balance: user.wallet_balance,
      },
    });
  });
});

// Get user information
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT u.user_id, u.username, ui.email, ui.wallet_balance
    FROM users u
    JOIN user_info ui ON u.user_id = ui.user_id
    WHERE u.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user information:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
  });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

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
