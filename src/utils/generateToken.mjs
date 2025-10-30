import jwt from "jsonwebtoken"
import { config } from "dotenv"
config();

const JWT_SCERET = process.env.JWT_SCERET

if (!JWT_SCERET) {
  console.log("JWT SECRET MISSING")
}

export const generateToken = async ({ userid }) => {
  const token = jwt.sign({ userId: userid }, JWT_SCERET)
  return token;
}