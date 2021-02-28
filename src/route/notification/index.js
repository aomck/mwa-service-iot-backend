import express from "express";
import * as notificationController from "../../controller/notification.controller";
const router = express.Router();

router.get("/", notificationController.getAll);
router.put("/:notificationId", notificationController.updateByid);

export default router;
