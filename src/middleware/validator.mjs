import { validationResult } from "express-validator"
import Response from "./../utils/response.mjs"
import { STATUS_CODE } from "../utils/appConstants.mjs";

export default function validator(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return Response({
      res,
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: errorArray[0].msg,
      success: false
    })
  }
  next();
}