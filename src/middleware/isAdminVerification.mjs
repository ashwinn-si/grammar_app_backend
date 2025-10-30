import { pool } from "../config/dbConnect.mjs";
import { STATUS_CODE } from "../utils/appConstants.mjs";
import CustomError from "../utils/customError.mjs";
import Response from "../utils/response.mjs"

export const isAdminVerification = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ? AND role = 'admin' AND is_deleted = 0`, [userId]);

    if (rows.length == 0) {
      throw new CustomError({
        message: "unauthorized access",
        statusCode: STATUS_CODE.UNAUTHORIZED
      })
    }

    next();
  } catch (err) {
    Response({
      res,
      message: err.message,
      statusCode: err.STATUS_CODE
    })
  }
}