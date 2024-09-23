import express from "express";
import {
  registerUser,
  loginUser,
  validateToken,
  checkUserStatus,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/validate-token", validateToken);
router.get("/check-status", checkUserStatus);

export default router;
