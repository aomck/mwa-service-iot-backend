import express from "express";
import * as deviceController from "../../controller/device.controller";
const router = express.Router();

//getAll
router.get("/", deviceController.getAll);
router.get("/history", deviceController.getAllhistory);
router.get("/station/:stationId", deviceController.getByStation);
//getByid
router.get("/:deviceId", deviceController.getById);
router.get("/:deviceId/history", deviceController.getAllhistoryByid);

//put
router.put("/:deviceId", deviceController.updateDevice);

export default router;
