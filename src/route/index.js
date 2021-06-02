import express from "express";
import healthRoute from "./health";
import deviceRoute from "./device";
import parameterRoute from "./parameter";
import notificationRoute from "./notification";
import projectRoute from "./project";
import stationRoute from "./station";
import productRoute from "./product";

const router = express.Router();

router.use("/", healthRoute);
router.use("/device", deviceRoute);
router.use("/parameter", parameterRoute);
router.use("/notification", notificationRoute);
router.use("/project", projectRoute);
router.use("/station", stationRoute);
router.use("/product", productRoute);

export default router;
