import { parameterService } from "../services";

export const getAll = async (req, res) => {
  try {
    const { user_id, query } = req;
    const respData = await parameterService.list({ user_id, query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getDisplay = async (req, res) => {
  try {
    const { user_id, query } = req;
    const respData = await parameterService.listDisplay({ user_id, query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const create = async (req, res) => {
  const { body, files, user_id } = req;

  try {
    await parameterService.create({ body, files, user_id });
    res.status(201).json({
      success: true,
      message: "parameter has been created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  const {
    body,
    params: { parameterId },
    files,
    user_id,
  } = req;

  try {
    const respData = await parameterService.update({
      body,
      parameterId,
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
    params: { parameterId },
    user_id,
  } = req;
  console.log("control param", parameterId, user_id);
  try {
    const respData = await parameterService.deleteById({
      parameterId,
      user_id,
    });
    res.status(200).json({
      success: true,
      message: "project has been deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
