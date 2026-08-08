import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (user.isActive === false) {
    return res
      .status(403)
      .json({ message: "This account has been deactivated. Contact your manager." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({
    token,
    user: { name: user.name, email: user.email, role: user.role, department: user.department },
  });
});

// REGISTER
router.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    ...req.body,
    password: hashed,
  });

  await user.save();
  res.json(user);
});

export default router;