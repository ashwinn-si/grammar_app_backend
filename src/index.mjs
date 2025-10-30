import express from "express"

import authRouter from "./router/login.router.mjs"
import aiRouter from "./router/ai.router.mjs"

const router = express.Router();

router.use("/auth", authRouter)
router.use("/ai", aiRouter)

router.get("/", (req, res) => {
  res.json("i am alive")
})

export default router;