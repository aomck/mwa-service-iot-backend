import { userService } from "../services";

export const getAll = async (req, res) => {
  try {
    const { headers, query } = req;
    const session = headers["session_token"];
    const respData = await userService.list({ session, query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getAllByRole = async (req, res) => {
  try {
    const { headers, query } = req;
    const session = headers["session_token"];
    const respData = await userService.listByRole({ session, query });
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
      headers,
      params: { userId },
    } = req;
    const session = headers["session_token"];
    const respData = await userService.view({ session, userId });
    !respData
      ? res.status(404).json({ statusCode: 404, message: "Not Found" })
      : res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const profile = async (req, res) => {
  try {
    const {
      headers,
      params: { userId },
    } = req;
    const session = headers["session_token"];
    const respData = await userService.profile({ session, userId });
    !respData
      ? res.status(404).json({ statusCode: 404, message: "Not Found" })
      : res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const profileMainId = async (req, res) => {
  try {
    const {
      headers,
      params: { mainUserId },
    } = req;
    const session = headers["session_token"];
    const respData = await userService.profileMainId({ session, mainUserId });
    !respData
      ? res.status(404).json({ statusCode: 404, message: "Not Found" })
      : res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const profileImg = async (req, res) => {
  try {
    // console.log("request xxxx")
    const {
      headers,
      params: { date, userId },
    } = req;
    const session = headers["session_token"];
    const respData = await userService.profileImg({
      session,
      userId,
    });
    res.set("Content-Type", "image/jpeg");
    res.send(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getRole = async (req, res) => {
  try {
    const { headers } = req;
    const session = headers["session_token"];
    const respData = await userService.role({ session });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getConfig = async (req, res) => {
  try {
    const { headers } = req;
    const session = headers["session_token"];
    const respData = await userService.getConfig({ session });
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
    const respData = await userService.create({ session, body });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const updateById = async (req, res) => {
  try {
    const { headers, body } = req;
    const { userId } = req.params;
    const session = headers["session_token"];
    const respData = await userService.update({ session, body, userId });
    !respData
      ? res.status(401).json({ statusCode: 401, message: "unauthorized" })
      : res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { headers, body } = req;
    const { userId } = req.params;
    const session = headers["session_token"];
    const respData = await userService.deleteUser({ session, body, userId });
    !respData
      ? res.status(401).json({ statusCode: 401, message: "unauthorized" })
      : res
          .status(200)
          .json({ success: true, message: "delete have been successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
