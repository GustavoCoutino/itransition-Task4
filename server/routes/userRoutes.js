import express from "express";
import {
  blockUsers,
  unblockUsers,
  deleteUsers,
  getAllUsers,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/block", authMiddleware, blockUsers);
router.put("/unblock", authMiddleware, unblockUsers);
router.delete("/delete", authMiddleware, deleteUsers);
router.get("/all", authMiddleware, getAllUsers);

export default router;
