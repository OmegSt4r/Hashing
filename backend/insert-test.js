//const mysql = require("mysql2");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
// Load environment variables from .env file
dotenv.config();

// Define your credentials using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Optional if 3306 is the default port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Function to insert user data into the database
async function insertUserData(
  username,
  password,
  email,
  encryptionType,
  iv,
  salt
) {
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
}

// Example usage
insertUserData(
  "example_username2",
  "example_password2",
  "example_email@example.com2",
  "AES",
  "00112233445566778899AABBCCDDEEFF",
  "00112233445566778899AABBCCDDEEFF"
);
