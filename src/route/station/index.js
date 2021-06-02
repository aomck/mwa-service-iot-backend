import express from "express";
import * as stationController from "../../controller/station.controller";
import multer from "multer";
import { body, validationResult, check } from "express-validator";

const upload = multer({});
const createvalidateion = [
  body("name").not().isEmpty(),
  body("code").not().isEmpty(),
];

const validationField = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

const router = express.Router();

router.get("/", stationController.getAll);
router.post(
  "/",
  upload.single("map"),
  createvalidateion,
  validationField,
  stationController.create
);
router.get("/:stationId", stationController.getById);
router.patch(
  "/:stationId",
  upload.single("map"),
  createvalidateion,
  validationField,
  stationController.update
);
router.delete("/:stationId", stationController.deleteByid);

export default router;
