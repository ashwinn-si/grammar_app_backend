import { createUserService, loginService } from "../service/login.service.mjs";
import { STATUS_CODE } from "../utils/appConstants.mjs";
import Response from "../utils/response.mjs"

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { data: token } = await loginService({ username, password });
    Response({
      res,
      message: "Login Sucessfull",
      statusCode: STATUS_CODE.OK,
      data: {
        token: token
      }
    })
  } catch (err) {
    Response({
      res,
      message: err.message,
      statusCode: err.statusCode
    })
  }
}

export const createUserController = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    await createUserService({ username, password, name });
    Response({
      res,
      message: "User Created Successfull",
      statusCode: STATUS_CODE.OK
    })
  } catch (err) {
    Response({
      res,
      message: err.message,
      statusCode: err.statusCode
    })
  }
}