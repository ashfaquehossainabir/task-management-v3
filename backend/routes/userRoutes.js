import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../controllers/userController.js";
import { verifyToken, managerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.post("/create", verifyToken, managerOnly, createUser);
router.put("/:id", verifyToken, managerOnly, updateUser);
router.delete("/:id", verifyToken, managerOnly, deleteUser);
router.patch("/:id/status", verifyToken, managerOnly, toggleUserStatus);

export default router;
