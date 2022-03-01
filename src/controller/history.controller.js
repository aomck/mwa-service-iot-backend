import { historyService } from "../services";

export const createHistory = async (req, res) => {
  try {
    const { body, device_code, device_token } = req;
    // console.log("xxxxxx", device_code;
    const respData = await historyService.create({
      device_code,
      device_token,
      body,
    });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
