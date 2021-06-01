import express from "express";
import * as projectController from "../../controller/project.controller";
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

router.get("/", projectController.getAll);
router.get("/:projectId", projectController.getById);
router.post(
  "/",
  upload.single("icon"),
  createvalidateion,
  validationField,
  projectController.create
);
router.patch(
  "/:projectId",
  upload.single("icon"),
  createvalidateion,
  validationField,
  projectController.update
);
export default router;
