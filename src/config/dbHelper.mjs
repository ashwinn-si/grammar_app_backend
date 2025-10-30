import { DEFAULT_USER_CREDENTIALS } from "../utils/appConstants.mjs";
import { getHashPassword } from "../utils/hashPassword.mjs";
import { pool } from "./dbConnect.mjs";

export async function createTableDB() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      name VARCHAR(100) DEFAULT '',
      is_deleted TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    await pool.query(`CREATE TABLE IF NOT EXISTS history (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type ENUM('general', 'whatsapp', 'email') NOT NULL DEFAULT 'general',
      input TEXT,
      output TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    console.log("Tables Created Successfully")
  } catch (err) {
    console.error("Error in creating table:", err);
  }
}

export const createDefaultUser = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE username = ? AND is_deleted = 0`,
      [DEFAULT_USER_CREDENTIALS.USERNAME]
    );
    if (rows.length > 0) {
      console.log("Default Admin Already Exists");
      return;
    }

    const hashPassword = await getHashPassword({ password: DEFAULT_USER_CREDENTIALS.PASSWORD });
    await pool.query(
      `INSERT INTO users(username, password, name) VALUES (?, ?, ?)`,
      [DEFAULT_USER_CREDENTIALS.USERNAME, hashPassword, DEFAULT_USER_CREDENTIALS.NAME]
    );
    console.log("Admin Created");
  } catch (err) {
    console.error("Error in creating default User:", err);
  }
}