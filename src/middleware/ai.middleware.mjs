import { body } from "express-validator"
import { INPUT_TYPES } from "../utils/appConstants.mjs"
import validator from "./validator.mjs"

export const getOutputMiddleware = [
  body("input").isString().isLength({ min: 1 }).withMessage("Give input"),
  body("type").isString().isIn([...Object.values(INPUT_TYPES)]).withMessage("Invalid type"),
  validator
]

export const getHistoryMiddleware = [
  body("page").isNumeric({ min: 1 }).withMessage("page is required"),
  validator
]