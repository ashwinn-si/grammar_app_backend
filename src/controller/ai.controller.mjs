import { getAIResponseService, saveHistoryService } from "../service/ai.service.mjs";
import { STATUS_CODE } from "../utils/appConstants.mjs";
import Response from "../utils/response.mjs";

export const getOutputController = async (req, res) => {
  try {
    const { input, type } = req.body;
    const { userId } = req.user;
    const { data: response } = await getAIResponseService({ input, type });
    await saveHistoryService({ userId, input, type, output: response });
    Response({
      res,
      message: "response",
      statusCode: STATUS_CODE.OK,
      data: {
        data: response
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