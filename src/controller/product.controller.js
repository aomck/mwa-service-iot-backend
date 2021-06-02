import { productService } from "../services";

export const getAll = async (req, res) => {
  try {
    const respData = await productService.list();
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const getById = async (req, res) => {
  const {
    params: { productId },
  } = req;

  try {
    const respData = await productService.view({ productId });
    !respData
      ? res.status(400).json({ statusCode: "400", message: "Bad Request" })
      : res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  const {
    body,
    params: { productId },
  } = req;

  try {
    const respData = await productService.view({ productId });
    !respData &&
      res.status(400).json({ statusCode: "400", message: "Bad Request" });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }

  try {
    const respData = await productService.update({ body, productId });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const create = async (req, res) => {
  const { body } = req;

  try {
    const respData = await productService.create({ body });
    res.status(201).json({
      success: true,
      message: "product has been created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};

export const deleteByid = async (req, res) => {
  const {
    params: { productId },
  } = req;

  try {
    const respData = await productService.view({ productId });
    !respData &&
      res.status(400).json({ statusCode: "400", message: "Bad Request" });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }

  try {
    const respData = await productService.deleteById({ productId });
    res.status(200).json({
      success: true,
      message: "product has been deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
