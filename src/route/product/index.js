import express from "express";
import * as productController from "../../controller/product.controller";
const router = express.Router();

router.get("/", productController.getAll);
router.get("/:productId", productController.getById);

export default router;
