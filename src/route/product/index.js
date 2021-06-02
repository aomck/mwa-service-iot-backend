import express from "express";
import * as productController from "../../controller/product.controller";
const router = express.Router();

router.get("/", productController.getAll);
router.post("/", productController.create);
router.get("/:productId", productController.getById);
router.patch("/:productId", productController.update);
router.delete("/:productId", productController.deleteByid);

export default router;
