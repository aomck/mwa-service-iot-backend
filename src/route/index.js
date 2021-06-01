import express from "express";
import healthRoute from "./health";
import deviceRoute from "./device";
import parameterRoute from "./parameter";
import notificationRoute from "./notification";
import projectRoute from "./project";

const router = express.Router();

router.use("/", healthRoute);
router.use("/device", deviceRoute);
router.use("/parameter", parameterRoute);
router.use("/notification", notificationRoute);
router.use("/project", projectRoute);

export default router;
