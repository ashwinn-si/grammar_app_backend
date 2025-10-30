import jwt from 'jsonwebtoken'
import CustomError from '../utils/customError.mjs'
import { STATUS_CODE } from '../utils/appConstants.mjs'
import Response from '../utils/response.mjs'

const JWT_SCERET = process.env.JWT_SCERET

if (!JWT_SCERET) {
  console.log("JWT SECRET MISSING")
}


export const jwtVerification = async (req, res, next) => {
  try {
    const token = getToken(req);

    const decodeInfo = jwt.verify(token, JWT_SCERET);
    if (!decodeInfo) {
      throw new CustomError({
        message: "JWT Token Error",
        statusCode: STATUS_CODE.UNAUTHORIZED
      })
    }
    req.user = decodeInfo;
    next();
  } catch (err) {
    Response({
      res,
      message: err.message,
      statusCode: err.STATUS_CODE
    })
  }
}

const getToken = (req) => {
  try {
    const authToken = req.headers['authorization']
    if (!authToken || !authToken.startsWith('Bearer ')) {
      throw new CustomError({
        message: "JWT Token Missing",
        statusCode: STATUS_CODE.UNAUTHORIZED
      })
    }
    const token = authToken.split(" ")
    return token[1];
  } catch (err) {
    throw err;
  }
}