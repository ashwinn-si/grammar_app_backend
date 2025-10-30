import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_NAME = process.env.DB_NAME
const DB_PASS = process.env.DB_PASS
const DB_PORT = process.env.DB_PORT

if (!DB_HOST || !DB_USER || !DB_NAME || !DB_PASS || !DB_PORT) {
  console.log("DB CREDENTIALS NOT FOUND")
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function connectionDB() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("Connected to Database");
  } catch (err) {
    console.error("Error in connecting to the Database " + err);
  }
}