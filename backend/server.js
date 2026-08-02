import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { startTaskReminderJob } from "./jobs/taskReminderJob.js";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES (FIRST)
====================== */
// Comma-separated list of allowed frontend origins, e.g.
// FRONTEND_URL=http://localhost:5173,https://your-app.vercel.app
// Falls back to allowing all origins if not set, so the app keeps
// working out of the box during initial setup.
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : "*";

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ======================
   DATABASE
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));


// START CRON JOB
startTaskReminderJob();

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);