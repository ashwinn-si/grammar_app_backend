import { STATUS_CODE } from "./appConstants.mjs"

export default class CustomError extends Error {
  constructor({ message, statusCode = STATUS_CODE.BAD_REQUEST }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}