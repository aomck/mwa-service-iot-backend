import express from "express";
import * as deviceController from "../../controller/device.controller";
const router = express.Router();

//getAll
router.get("/", deviceController.getAll);
router.get("/history", deviceController.getAllhistory);

//getByid
router.get("/:deviceId", deviceController.getById);
router.get("/:deviceId/history", deviceController.getAllhistoryByid);

export default router;
