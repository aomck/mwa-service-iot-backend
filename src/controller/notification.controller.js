import { notificationService } from "../services";

export const getAll = async (req, res) => {
  try {
    const { query } = req;
    const respData = await notificationService.list({ query });
    console.log("respData :::", respData.length);
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const updateByid = async (req, res) => {
  try {
    const {
      body,
      params: { notificationId },
    } = req;
    const respData = await notificationService.update({ body, notificationId });
    if (respData) {
      res.status(204).end();
    }
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
