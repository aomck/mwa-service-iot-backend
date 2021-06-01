import { projectService } from "../services";

export const getAll = async (req, res) => {
  try {
    const respData = await projectService.list();
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
