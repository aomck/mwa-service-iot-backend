import express from "express";
import healthRoute from "./health";
import userRoute from "./user";
import roleRoute from "./role";
import unitRoute from "./unit";
import deviceRoute from "./device";
import parameterRoute from "./parameter";
import notificationRoute from "./notification";
import projectRoute from "./project";
import stationRoute from "./station";
import productRoute from "./product";
import utilsRoute from './utils'

const router = express.Router();

router.use("/", healthRoute);
router.use("/user", userRoute);
router.use("/role", roleRoute);
router.use("/unit", unitRoute);
router.use("/device", deviceRoute);
router.use("/parameter", parameterRoute);
router.use("/notification", notificationRoute);
router.use("/project", projectRoute);
router.use("/station", stationRoute);
router.use("/product", productRoute);
router.use("/code",utilsRoute)

export default router;
