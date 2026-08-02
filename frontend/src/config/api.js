/**
 * Central place for the backend API base URL.
 *
 * Reads from the VITE_API_URL environment variable (set in `.env` locally,
 * or in your hosting provider's project settings, e.g. Vercel).
 *
 * Falls back to the original deployed Render backend if the variable
 * isn't set, so the app keeps working out of the box.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://task-management-app-v-2.onrender.com";
