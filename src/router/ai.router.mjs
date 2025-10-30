import express from "express"
import { jwtVerification } from "../middleware/jwtVerification.mjs";
import { getOutputMiddleware } from "../middleware/ai.middleware.mjs";
import { getOutputController } from "../controller/ai.controller.mjs";

const router = express.Router();

router.post("/get-response", jwtVerification, getOutputMiddleware, getOutputController);

export default router;