# TaskFlow — Task Management App

A full-stack MERN task management application with role-based dashboards
(Manager / Leader / Employee), a responsive sidebar, real-time task tracking,
analytics, and automated deadline email reminders.

- **Frontend:** React 19 + Vite, React Router, Chart.js, lucide-react
- **Backend:** Node.js + Express 5, MongoDB (Mongoose), JWT auth, node-cron
- **Suggested hosting:** Frontend → **Vercel**, Backend → **Render**, Database → **MongoDB Atlas**

Both the frontend's API URL and the backend's allowed CORS origin(s) are
fully configurable via environment variables — no source code edits needed
to point this app at your own backend/frontend deployment.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Local Installation](#local-installation)
4. [Environment Variables](#environment-variables)
5. [Creating Your First User](#creating-your-first-user)
6. [Deploying the Backend to Render](#deploying-the-backend-to-render)
7. [Deploying the Frontend to Vercel](#deploying-the-frontend-to-vercel)
8. [Connecting Frontend and Backend](#connecting-frontend-and-backend)
9. [Post-Deployment Checklist](#post-deployment-checklist)
10. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
task-management-app-v2.1/
├── backend/                   # Express API
│   ├── controllers/
│   ├── jobs/                  # node-cron deadline reminder job
│   ├── middleware/            # JWT auth + role guards
│   ├── models/                # Mongoose schemas (User, Task)
│   ├── routes/                # /api/auth, /api/tasks, /api/users, /api/stats
│   ├── utils/                 # Nodemailer email sender
│   ├── server.js              # App entry point (reads FRONTEND_URL for CORS)
│   ├── .env.example
│   └── package.json
│
└── frontend/                  # React + Vite SPA
    ├── src/
    │   ├── config/api.js      # Reads VITE_API_URL — single source of truth
    │   ├── components/        # Sidebar, TaskCard, modals, forms
    │   ├── context/           # AuthContext, TaskContext
    │   ├── dashboards/        # Admin & Employee routed pages
    │   └── pages/             # Login, RegisterUser
    ├── vercel.json             # SPA rewrite rule (already included)
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- **Node.js** 18+ and npm
- A **MongoDB** database — either a local MongoDB instance or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended)
- A **Gmail account (or other SMTP provider)** if you want deadline reminder
  emails to work — optional, the app runs fine without it
- Accounts on **[Render](https://render.com)** and **[Vercel](https://vercel.com)**
  for deployment (both have free tiers)

---

## Local Installation

### 1. Clone / unzip the project

```bash
cd task-management-app-v2.1
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your own values in `backend/.env` (see [Environment Variables](#environment-variables)).

Run the backend:

```bash
npm run dev      # starts with nodemon on http://localhost:5000
# or
npm start        # plain node
```

You should see:

```
MongoDB Connected
Server running on port 5000
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

By default `frontend/.env.example` points `VITE_API_URL` at
`http://localhost:5000`, matching the backend above — adjust it if your
backend runs elsewhere.

```bash
npm run dev       # starts Vite dev server, usually on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Required | Description                                                                            |
|----------------|----------|------------------------------------------------------------------------------------------|
| `MONGO_URI`    | Yes      | MongoDB connection string (Atlas or local, e.g. `mongodb://localhost:27017/taskflow`)   |
| `JWT_SECRET`   | Yes      | Any long random string used to sign login tokens                                        |
| `PORT`         | No       | Port for the API server (defaults to `5000`)                                            |
| `FRONTEND_URL` | No       | Comma-separated list of allowed CORS origins (defaults to `*`, allowing any origin)      |
| `EMAIL_USER`   | No*      | Email address used to send deadline reminder emails (e.g. Gmail address)                |
| `EMAIL_PASS`   | No*      | App password for the email account above (not your regular password)                   |

\* `EMAIL_USER` / `EMAIL_PASS` are only needed if you want the daily 10 AM
deadline reminder cron job to actually send emails. If a Gmail account is used,
generate an [App Password](https://myaccount.google.com/apppasswords) rather
than using your login password.

Example `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/taskflow
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
FRONTEND_URL=http://localhost:5173,https://your-app.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

> `FRONTEND_URL` accepts multiple comma-separated origins, so you can allow
> both your local dev server and your live Vercel deployment at once. Leave
> it unset during initial local setup and the API will accept requests from
> any origin.

### Frontend (`frontend/.env`)

| Variable       | Required | Description                                                            |
|----------------|----------|--------------------------------------------------------------------------|
| `VITE_API_URL` | Yes      | Base URL of the backend API, no trailing slash (e.g. `http://localhost:5000`) |

Example `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

All API calls in the frontend (`src/context/AuthContext.jsx`,
`src/context/TaskContext.jsx`, `TaskForm`, `EditTaskModal`, `RegisterUser`,
`AdminOverviewPage`) import this value from `src/config/api.js`, so changing
`VITE_API_URL` in one place updates every request.

> **Vite env var note:** changes to `.env` require restarting `npm run dev`
> to take effect — Vite only reads env files on startup.

---

## Creating Your First User

There's no seed script, so create your first account directly against the
open registration endpoint before logging in through the UI.

**Using curl:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "yourpassword",
    "role": "manager"
  }'
```

**Or using Postman/Insomnia:** `POST` to `/api/auth/register` with the same JSON body.

Notes:

- `role` must be one of `"admin"`, `"manager"`, or `"employee"`.
- Only the **`manager`** role sees the "Create User" button in the Employees
  page of the dashboard — use it to create additional users afterward without
  needing curl again.
- Login on the app uses the **`name`** field (not email) plus password.

---

## Deploying the Backend to Render

1. Push the project to a GitHub/GitLab repository (Render deploys from Git).
2. In the [Render Dashboard](https://dashboard.render.com), click
   **New → Web Service** and connect your repository.
3. Configure the service:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid, for no cold starts)
4. Add environment variables under **Environment → Environment Variables**:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` — set this to your Vercel URL once you have it (see below);
     you can leave it unset for now and add it after deploying the frontend
   - `EMAIL_USER` / `EMAIL_PASS` (optional)
   - You do **not** need to set `PORT` — Render provides it automatically and
     `server.js` already falls back to `process.env.PORT`.
5. Click **Create Web Service**. Render will build and deploy automatically,
   and redeploy on every push to your connected branch.
6. Once live, note your backend URL, e.g.:

   ```
   https://your-app-name.onrender.com
   ```

7. Verify it's running by visiting the URL directly — you should see:

   ```
   Backend is running 🚀
   ```

**MongoDB Atlas note:** if using Atlas, go to **Network Access** in the Atlas
dashboard and allow access from `0.0.0.0/0` (or Render's specific IPs) so
Render can reach your cluster.

**Free tier note:** Render's free web services spin down after inactivity, so
the first request after idling can take 30–60 seconds to respond. This is
expected behavior, not an error.

---

## Deploying the Frontend to Vercel

The frontend already includes a `vercel.json` with the SPA rewrite rule
required for client-side routing (React Router) to work correctly on refresh
and direct URL access:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Steps

1. Push the project to GitHub/GitLab (if not already).
2. In the [Vercel Dashboard](https://vercel.com/new), click **Add New → Project**
   and import your repository.
3. Configure the project:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (should be auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = your Render backend URL, e.g. `https://your-app-name.onrender.com`
5. Click **Deploy**.
6. Once live, Vercel gives you a URL like:

   ```
   https://your-app-name.vercel.app
   ```

Every push to your connected branch will trigger an automatic redeploy.
If you change `VITE_API_URL` later in Vercel's project settings, trigger a
**Redeploy** — Vite bakes env vars in at build time, so a settings change
alone won't take effect until the next build.

---

## Connecting Frontend and Backend

Once both are deployed, wire them together:

1. **Backend → allow the frontend's origin:**
   In Render, set `FRONTEND_URL` to your Vercel URL (e.g.
   `https://your-app-name.vercel.app`). You can include your local dev URL
   too, comma-separated: `http://localhost:5173,https://your-app-name.vercel.app`.
   Redeploy the backend for the change to take effect.

2. **Frontend → point at the backend:**
   In Vercel, set `VITE_API_URL` to your Render URL (e.g.
   `https://your-app-name.onrender.com`), then redeploy the frontend.

That's it — no source code changes are required in either app to connect
them; both URLs live entirely in environment variables.

---

## Post-Deployment Checklist

- [ ] Backend deployed on Render and responds at `/` with "Backend is running 🚀"
- [ ] `MONGO_URI` and `JWT_SECRET` set in Render's environment variables
- [ ] MongoDB Atlas network access allows connections from Render
- [ ] `FRONTEND_URL` set on Render to your Vercel URL
- [ ] Frontend deployed on Vercel with **Root Directory** set to `frontend`
- [ ] `VITE_API_URL` set on Vercel to your Render URL, and redeployed after setting it
- [ ] First user created via `POST /api/auth/register` (role: `manager` recommended)
- [ ] Logged in successfully on the deployed Vercel URL
- [ ] (Optional) `EMAIL_USER` / `EMAIL_PASS` set if deadline reminder emails are wanted

---

## Troubleshooting

**Login fails / "Invalid credentials" immediately**
Make sure you're logging in with the `name` field used during registration,
not the email — the login form matches on `name`.

**CORS errors in the browser console**
Confirm `FRONTEND_URL` on Render exactly matches your Vercel URL (including
`https://`, no trailing slash), then redeploy the backend. If `FRONTEND_URL`
is unset, CORS defaults to allowing all origins, so this usually means a typo
in the value.

**Frontend requests are going to the wrong backend / 404s on API calls**
Confirm `VITE_API_URL` is set correctly in Vercel's project environment
variables, then trigger a fresh deployment — env var changes don't apply
retroactively to a previous build.

**Frontend shows a blank page after refreshing on a route like `/admin/tasks`**
This means `vercel.json`'s rewrite rule isn't being picked up — confirm
**Root Directory** is set to `frontend` in the Vercel project settings so
`vercel.json` is found at the project root Vercel builds from.

**Backend takes ~30–60s to respond after being idle**
Expected on Render's free tier — the service spins down after inactivity and
"cold starts" on the next request. Upgrade to a paid instance to avoid this.

**Deadline reminder emails aren't sending**
Confirm `EMAIL_USER` / `EMAIL_PASS` are set on Render and that you're using an
App Password (not your normal password) if using Gmail. Also note the cron
job only runs once daily at 10:00 AM server time.

**"Manager access only" error when creating a user**
Only accounts with the `manager` role can create new users via the "Create
User" button or the `/api/users/create` endpoint. Register your first account
with `"role": "manager"` if you plan to create other users through the UI.
