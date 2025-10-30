import express from "express"
import { createUserValidator, loginValidator } from "./../middleware/login.middleware.mjs"
import { createUserController, loginController } from "../controller/login.controller.mjs";
import { jwtVerification } from "../middleware/jwtVerification.mjs";
import { isAdminVerification } from "../middleware/isAdminVerification.mjs"
const router = express.Router();

router.post('/login', loginValidator, loginController)

router.post('/create-user', jwtVerification, isAdminVerification, createUserValidator, createUserController)
export default router;