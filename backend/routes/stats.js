import express from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  isDepartmentScoped,
  getDepartmentMemberNames,
} from "../utils/departmentScope.js";

const router = express.Router();

// GET USERS COUNT
router.get("/users", verifyToken, async (req, res) => {
  try {
    const filter = isDepartmentScoped(req.user)
      ? { department: req.user.department || "" }
      : {};

    const userCount = await User.countDocuments(filter);
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET TASKS COUNT
router.get("/tasks", verifyToken, async (req, res) => {
  try {
    let filter = {};

    if (isDepartmentScoped(req.user)) {
      const memberNames = await getDepartmentMemberNames(req.user.department);
      filter = { assignedTo: { $in: memberNames } };
    }

    const taskCount = await Task.countDocuments(filter);
    res.json({ count: taskCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;