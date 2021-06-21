import express from "express";
import * as unitController from "../../controller/unit.controller";

const router = express.Router();

router.get("/option", unitController.option);
router.get("/", unitController.get);
router.post("/", unitController.create);
router.get("/:unitId", unitController.view);
router.put("/:unitId", unitController.update);
router.delete("/:unitId", unitController.deleteById);

export default router;
