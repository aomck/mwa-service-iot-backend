import express from "express";
import * as parameterController from "../../controller/parameter.controller";
const router = express.Router();

//getAll
router.get("/", parameterController.getAll);
export default router;
