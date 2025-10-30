import express from "express"
import { loginValidator } from "./../middleware/login.middleware.mjs"
import { loginController } from "../controller/login.controller.mjs";
const router = express.Router();

router.post('/login', loginValidator, loginController)

export default router;