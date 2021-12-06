import express from "express";
import * as loraController from "../../controller/lora.controller";
const router = express.Router();
import multer from "multer";
const upload = multer({});
//getByid
router.get("/:lora_id", loraController.getById);


export default router;
