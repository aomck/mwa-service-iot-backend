import { projectService } from "../services";

export const getAll = async (req, res) => {
  try {
    const { user_id } = req;
    const respData = await projectService.list({ user_id });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getAllStation = async (req, res) => {
  try {
    const { user_id } = req;
    const respData = await projectService.listStation({ user_id });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getById = async (req, res) => {
  const {
    params: { projectId },
  } = req;

  try {
    const respData = await projectService.view({ projectId });
    !respData
      ? res.status(400).json({ statusCode: "400", message: "Bad Request" })
      : res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const create = async (req, res) => {
  const { body, file } = req;

  try {
    await projectService.create({ body, file });
    res.status(201).json({
      success: true,
      message: "project has been created successfully",
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
    params: { projectId },
    file,
  } = req;

  try {
    const respData = await projectService.view({ projectId });
    !respData &&
      res.status(400).json({ statusCode: "400", message: "Bad Request" });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }

  try {
    const respData = await projectService.update({ body, projectId, file });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const deleteByid = async (req, res) => {
  const {
    params: { projectId },
  } = req;

  try {
    const respData = await projectService.view({ projectId });
    !respData &&
      res.status(400).json({ statusCode: "400", message: "Bad Request" });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }

  try {
    const respData = await projectService.deleteById({ projectId });
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
