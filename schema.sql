CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL
);

CREATE TABLE user_info (
  user_id INT,
  u_password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  p_encryption_type VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);