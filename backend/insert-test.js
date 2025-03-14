const mysql = require("mysql2");
const dotenv = require("dotenv");

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
function insertUserData(username, password, email, encryptionType, iv, salt) {
  // Create a connection to the database
  const connection = mysql.createConnection({
    ...dbConfig,
    authPlugins: {
      sha256_password: () => (data, cb) => {
        cb(null, Buffer.from(dbConfig.password));
      },
    },
  });

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to the database");

    // Start a transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        connection.end();
        return;
      }

      // Insert a new user into the users table
      connection.query(
        "INSERT INTO users (username) VALUES (?)",
        [username],
        (err, results) => {
          if (err) {
            console.error("Error inserting user:", err);
            connection.rollback(() => {
              connection.end();
            });
            return;
          }

          // Retrieve the user_id of the newly inserted user
          const userId = results.insertId;

          // Insert the corresponding user information into the user_info table
          connection.query(
            "INSERT INTO user_info (user_id, u_password, email, p_encryption_type) VALUES (?, ?, ?, ?)",
            [userId, password, email, encryptionType],
            (err) => {
              if (err) {
                console.error("Error inserting user info:", err);
                connection.rollback(() => {
                  connection.end();
                });
                return;
              }

              // Insert the security data into the security_data table
              connection.query(
                "INSERT INTO security_data (user_id, iv, salt) VALUES (?, UNHEX(?), UNHEX(?))",
                [userId, iv, salt],
                (err) => {
                  if (err) {
                    console.error("Error inserting security data:", err);
                    connection.rollback(() => {
                      connection.end();
                    });
                    return;
                  }

                  // Commit the transaction
                  connection.commit((err) => {
                    if (err) {
                      console.error("Error committing transaction:", err);
                      connection.rollback(() => {
                        connection.end();
                      });
                      return;
                    }

                    console.log("User data inserted successfully");
                    connection.end();
                  });
                }
              );
            }
          );
        }
      );
    });
  });
}

// Example usage
insertUserData(
  "example_username",
  "example_password",
  "example_email@example.com",
  "AES",
  "00112233445566778899AABBCCDDEEFF",
  "00112233445566778899AABBCCDDEEFF"
);
