import express from "express";
import healthRoute from "./health";

const router = express.Router();

router.use("/v1", healthRoute);

export default router;
