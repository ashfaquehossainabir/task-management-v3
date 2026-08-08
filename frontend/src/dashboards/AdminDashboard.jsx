import { Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  AlarmClock,
  Users,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import AdminOverviewPage from "./admin-pages/AdminOverviewPage";
import AdminAnalyticsPage from "./admin-pages/AdminAnalyticsPage";
import AdminTeamBreakdownPage from "./admin-pages/AdminTeamBreakdownPage";
import AdminDeadlinesPage from "./admin-pages/AdminDeadlinesPage";
import AdminEmployeesPage from "./admin-pages/AdminEmployeesPage";
import AdminTasksPage from "./admin-pages/AdminTasksPage";
import AdminUserManagementPage from "./admin-pages/AdminUserManagementPage";
import "./AdminDashboard.css";

const BASE_ADMIN_NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/team", label: "Team Breakdown", icon: PieChart },
  { to: "/admin/deadlines", label: "Deadlines", icon: AlarmClock },
  { to: "/admin/employees", label: "Employees", icon: Users },
  { to: "/admin/tasks", label: "All Tasks", icon: ListChecks },
];

const MANAGER_NAV_ITEM = {
  to: "/admin/users",
  label: "Manage Users",
  icon: ShieldCheck,
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const isManager = user.role === "manager";

  const navItems = isManager
    ? [...BASE_ADMIN_NAV_ITEMS, MANAGER_NAV_ITEM]
    : BASE_ADMIN_NAV_ITEMS;

  return (
    <div className="app-layout">
      <Sidebar navItems={navItems} />

      <div className="main-content">
        <div className="container">
          {/* ===============================
              Header
          ================================ */}
          <div className="header">
            <div className="header-left">
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>

              <div className="header-text">
                <span className="eyebrow header-eyebrow">Leader Dashboard</span>
                <h2>Welcome back, {user.name.split(" ")[0]}</h2>
                <p>Here&rsquo;s what&rsquo;s happening across your team today.</p>
              </div>
            </div>

            <div className="header-meta">
              <span className="header-role-chip">{user.role}</span>
            </div>
          </div>

          <Routes>
            <Route index element={<AdminOverviewPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="team" element={<AdminTeamBreakdownPage />} />
            <Route path="deadlines" element={<AdminDeadlinesPage />} />
            <Route path="employees" element={<AdminEmployeesPage />} />
            <Route path="tasks" element={<AdminTasksPage />} />
            <Route
              path="users"
              element={
                isManager ? (
                  <AdminUserManagementPage />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
