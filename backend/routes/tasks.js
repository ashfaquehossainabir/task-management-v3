import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  isDepartmentScoped,
  getDepartmentMemberNames,
} from "../utils/departmentScope.js";

const router = express.Router();

// GET TASKS
router.get("/", verifyToken, async (req, res) => {
  let filter = {};

  if (isDepartmentScoped(req.user)) {
    const memberNames = await getDepartmentMemberNames(req.user.department);
    filter = { assignedTo: { $in: memberNames } };
  }

  const tasks = await Task.find(filter);
  res.json(tasks);
});

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const { title, assignedTo, priority, deadline, projectValue } = req.body;

    if (!title || !assignedTo || !deadline) {
      return res.status(400).json({
        message: "Title, assigned user, and deadline are required",
      });
    }

    // Check if assigned user exists
    const userExists = await User.findOne({ name: assignedTo });
    if (!userExists) {
      return res.status(400).json({ message: "User not found" });
    }

    const task = await Task.create({
      title,
      assignedTo,
      priority,
      deadline,
      projectValue: projectValue || 0,
      status: "todo",
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STATUS
router.patch("/:id", async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (assignedTo) {
      const userExists = await User.findOne({ name: assignedTo });

      if (!userExists) {
        return res.status(400).json({
          message: "User not found",
        });
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// EDIT TASK
router.put("/:id", async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (assignedTo) {
      const userExists = await User.findOne({ name: assignedTo });
      if (!userExists) {
        return res.status(400).json({ message: "User not found" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    console.error("Edit task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;