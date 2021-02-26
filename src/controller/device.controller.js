import { deviceService } from "../services";

export const getAll = async (req, res) => {
  try {
    const respData = await deviceService.list();
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getById = async (req, res) => {
  try {
    const {
      params: { deviceId },
    } = req;
    const respData = await deviceService.view({ deviceId });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const {
      params: { deviceId },
    } = req;
    const respData = await deviceService.viewHistory({ deviceId });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getAllhistory = async (req, res) => {
  try {
    const respData = await deviceService.listHistory();
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getAllhistoryByid = async (req, res) => {
  try {
    const {
      params: { deviceId },
      query,
    } = req;

    const respData = await deviceService.listViewHistory({ deviceId, query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
