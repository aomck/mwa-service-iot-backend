import express from "express";
import * as parameterController from "../../controller/parameter.controller";
import multer from "multer";

const upload = multer({});
const router = express.Router();

//getAll
router.get("/", parameterController.getAll);
router.get("/display", parameterController.getDisplay);
router.post("/", upload.array("files"), parameterController.create);
router.patch(
  "/:parameterId",
  upload.array("files"),
  parameterController.update
);
router.delete("/:parameterId", parameterController.deleteByid);
export default router;
