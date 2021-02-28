import express from "express";
import healthRoute from "./health";
import deviceRoute from "./device";
import parameterRoute from "./parameter";
import notificationRoute from "./notification";

const router = express.Router();

router.use("/", healthRoute);
router.use("/device", deviceRoute);
router.use("/parameter", parameterRoute);
router.use("/notification", notificationRoute);

export default router;
