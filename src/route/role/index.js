import express from "express";
import * as roleController from "../../controller/role.controller";

const router = express.Router();

router.get("/option", roleController.option);

export default router;
