import express from "express"
import authRouter from "./router/login.router.mjs"
const router = express.Router();

router.use("/auth", authRouter)

router.get("/", (req, res) => {
  res.json("i am alive")
})

export default router;