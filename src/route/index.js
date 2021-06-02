import express from "express";
import healthRoute from "./health";
import deviceRoute from "./device";
import parameterRoute from "./parameter";
import notificationRoute from "./notification";
import projectRoute from "./project";
import stationRoute from "./station";

const router = express.Router();

router.use("/", healthRoute);
router.use("/device", deviceRoute);
router.use("/parameter", parameterRoute);
router.use("/notification", notificationRoute);
router.use("/project", projectRoute);
router.use("/station", stationRoute);

export default router;
