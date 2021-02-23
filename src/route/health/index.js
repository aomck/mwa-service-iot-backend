import express from "express";
import * as healthController from "../../controller/health.controller";
const router = express.Router();

router.get("/health", healthController.getAll);

export default router;
