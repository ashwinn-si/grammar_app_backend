import { STATUS_CODE } from "./appConstants.mjs";

export default function Response({ res, statusCode = STATUS_CODE.BAD_REQUEST, message = "", data = [] }) {
  res.status(statusCode).json({
    message: message,
    data: data
  })
}