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

export const getTemplate = async (req, res) => {
  try {
    const respData = await deviceService.listTemplate();
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getByStation = async (req, res) => {
  try {
    const {
      params: { stationId },
    } = req;
    const respData = await deviceService.listByStation({ stationId });
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

export const createDevice = async (req, res) => {
  try {
    const {
      body,
      params: { stationId },
      files,
      user_id,
    } = req;
    const respData = await deviceService.create({
      body,
      stationId,
      files,
      user_id,
    });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const {
      body,
      params: { deviceId },
      files,
      user_id,
    } = req;
    const respData = await deviceService.update({
      body,
      deviceId,
      files,
      user_id,
    });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const deleteByid = async (req, res) => {
  const {
    params: { deviceId },
  } = req;

  try {
    const respData = await deviceService.deleteById({ deviceId });
    res.status(200).json({
      success: true,
      message: "station has been deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};