import bcrypt from "bcrypt"
import { config } from "dotenv"

const SALT = parseInt(process.env.SALT) || 10

export const getHashPassword = async ({ password }) => {
  try {
    const hashPassword = await bcrypt.hash(password, SALT);
    return hashPassword;
  } catch (err) {
    throw err;
  }

}

export const comparsePassword = async ({ userEnterPassword, hashPassword }) => {
  try {
    const result = await bcrypt.compare(userEnterPassword, hashPassword);
    return result;
  } catch (err) {
    throw err;
  }
}