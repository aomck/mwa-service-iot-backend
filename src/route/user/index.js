import express from "express";
import * as userController from "../../controller/user.controller";
import { checkAdmin, checkUser } from "../../middlewares";

const router = express.Router();

router.get("/", userController.getAll);
router.get("/byRole", checkAdmin, userController.getAllByRole);
router.get("/role", checkUser, userController.getRole);
router.get("/config", checkUser, userController.getConfig);
router.get("/profile/:userId", userController.profile);
router.get("/mainprofile/:mainUserId", userController.profileMainId);
router.get("/profileImg/:userId", userController.profileImg);
router.get("/:userId", userController.getById);
router.post("/", userController.create);
router.put("/:userId", userController.updateById);
router.delete("/:userId", userController.deleteById);

export default router;
