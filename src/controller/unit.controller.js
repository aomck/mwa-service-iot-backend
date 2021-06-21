import { unitService } from "../services";

export const get = async (req, res) => {
  try {
    const { headers, query } = req;
    const session = headers["session_token"];
    const respData = await unitService.get({ session, query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const view = async (req, res) => {
  try {
    const {
      headers,
      params: { unitId },
    } = req;
    const session = headers["session_token"];
    const respData = await unitService.view({ session, unitId });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const create = async (req, res) => {
  try {
    const { headers, body } = req;
    const session = headers["session_token"];
    const respData = await unitService.create({ session, body });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const {
      headers,
      body,
      params: { unitId },
    } = req;
    const session = headers["session_token"];
    const respData = await unitService.update({ session, unitId, body });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const deleteById = async (req, res) => {
  try {
    const {
      headers,
      params: { unitId },
    } = req;
    const session = headers["session_token"];
    const respData = await unitService.deleteById({ session, unitId });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const option = async (req, res) => {
  try {
    const { headers, query } = req;
    const session = headers["session_token"];
    const respData = await unitService.option({ session, query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
