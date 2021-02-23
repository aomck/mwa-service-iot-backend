import { healthService } from "../services";

export const getAll = async (req, res) => {
  try {
    const respData = await healthService.health();
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
