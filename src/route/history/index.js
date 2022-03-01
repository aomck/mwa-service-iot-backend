import express from "express";
import * as historyController from "../../controller/history.controller";
const router = express.Router();

//postByDeviceId
router.post("/:device_id", historyController.createHistory);


export default router;
