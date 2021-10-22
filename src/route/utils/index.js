import express from "express";
import * as utilsController from "../../controller/utils.controller";
import multer from "multer";
import { body, validationResult, check } from "express-validator";

const upload = multer({});
const router = express.Router();

router.get("/", utilsController.code);


export default router;
