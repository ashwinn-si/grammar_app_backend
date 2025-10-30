import { pool } from "../config/dbConnect.mjs";
import { STATUS_CODE } from "../utils/appConstants.mjs";
import CustomError from "../utils/customError.mjs";
import { generateToken } from "../utils/generateToken.mjs";
import { comparsePassword } from "../utils/hashPassword.mjs";

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