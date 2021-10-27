import express from "express";
import * as deviceController from "../../controller/device.controller";
const router = express.Router();
import multer from "multer";
const upload = multer({});

//getAll
router.get("/", deviceController.getAll);
router.get("/history", deviceController.getAllhistory);
router.get("/template", deviceController.getTemplate);
router.get("/station/:stationId", deviceController.getByStation);
//getByid
router.get("/:deviceId", deviceController.getById);
router.get("/:deviceId/history", deviceController.getAllhistoryByid);

//update
router.post(
  "/:stationId",
  upload.array("files"),
  deviceController.createDevice
);
router.patch(
  "/:deviceId",
  upload.array("files"),
  deviceController.updateDevice
);
router.delete("/:deviceId", deviceController.deleteByid);

export default router;
