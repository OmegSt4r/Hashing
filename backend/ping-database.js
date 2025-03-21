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

  // Ping the database
  connection.ping((err) => {
    if (err) {
      console.error("Error pinging the database:", err);
    } else {
      console.log("Database pinged successfully");
    }

    // Close the connection
    connection.end();
  });
});
module.exports=connection;