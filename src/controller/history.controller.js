import { historyService } from "../services";

export const createHistory = async (req, res) => {
  try {
    const {
      body,
      params: { device_id },
      headers: { device_token },
    } = req;
    const respData = await historyService.create({
      device_id,
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
