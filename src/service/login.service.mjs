import { pool } from "../config/dbConnect.mjs";
import { STATUS_CODE } from "../utils/appConstants.mjs";
import CustomError from "../utils/customError.mjs";
import { generateToken } from "../utils/generateToken.mjs";
import { comparsePassword, getHashPassword } from "../utils/hashPassword.mjs";

export const loginService = async ({ username, password }) => {
  try {
    console.log(username + " " + password)
    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ? AND is_deleted = 0`, [username]);

    if (rows.length < 1) {
      throw new CustomError({
        message: "User Not Found",
        statusCode: STATUS_CODE.NOT_FOUND
      })
    }
    const hashPassword = rows[0].password;
    const result = await comparsePassword({ hashPassword: hashPassword, userEnterPassword: password })
    if (!result) {
      throw new CustomError({
        message: "Incorrect Password",
        statusCode: STATUS_CODE.CONFLICT
      })
    }

    const token = await generateToken({ userid: rows[0].id });

    return {
      data: token
    }

  } catch (err) {
    throw err;
  }
}

export const createUserService = async ({ username, password, name }) => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        `SELECT * FROM users WHERE username = ? AND is_deleted = 0`,
        [username]
      );
      if (rows.length > 0) {
        throw new CustomError({
          message: "username already exists",
          statusCode: STATUS_CODE.BAD_REQUEST
        });
      }

      const hashPassword = await getHashPassword({ password });

      const [result] = await connection.query(
        `INSERT INTO users(username, password, name) VALUES (?, ?, ?)`,
        [username, hashPassword, name]
      );

      await connection.commit();
      // return inserted id for caller if needed
      return { insertId: result.insertId };
    } catch (err) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Rollback error:', rollbackErr);
      }
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw err;
  }
}