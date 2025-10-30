import { body } from "express-validator";
import validator from "./validator.mjs";

export const loginValidator = [
  body("username").isString().isLength({ min: 1 }).withMessage("Username is required"),
  body("password").isString().isLength({ min: 1 }).withMessage("Password is required"),
  validator
];

export const addUserValidator = [
  body("username").isString().isLength({ min: 1 }).withMessage("Username is required"),
  body("password").isString().isLength({ min: 1 }).withMessage("Password is required"),
  body("name").isString().isLength({ min: 1 }).withMessage("Name is required"),
  validator
];