import { Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  AlarmClock,
  CalendarDays,
  ListChecks,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import EmployeeOverviewPage from "./employee-pages/EmployeeOverviewPage";
import EmployeeProgressPage from "./employee-pages/EmployeeProgressPage";
import EmployeeDeadlinesPage from "./employee-pages/EmployeeDeadlinesPage";
import EmployeeWeeklySummaryPage from "./employee-pages/EmployeeWeeklySummaryPage";
import EmployeeTasksPage from "./employee-pages/EmployeeTasksPage";
import "./EmployeeDashboard.css";

const EMPLOYEE_NAV_ITEMS = [
  { to: "/employee", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/employee/progress", label: "Progress", icon: TrendingUp },
  { to: "/employee/deadlines", label: "Deadlines", icon: AlarmClock },
  {
    to: "/employee/weekly-summary",
    label: "Weekly Summary",
    icon: CalendarDays,
  },
  { to: "/employee/tasks", label: "My Tasks", icon: ListChecks },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar navItems={EMPLOYEE_NAV_ITEMS} />

      <div className="main-content">
        <div className="container">
          {/* ===============================
              Header
          ================================ */}
          <div className="header">
            <div className="header-left">
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>

              <div className="header-text">
                <span className="eyebrow header-eyebrow">Employee Dashboard</span>
                <h2>Welcome back, {user.name.split(" ")[0]}</h2>
                <p>Here&rsquo;s where your tasks stand today.</p>
              </div>
            </div>

            <div className="header-meta">
              <span className="header-role-chip">{user.role}</span>
            </div>
          </div>

          <Routes>
            <Route index element={<EmployeeOverviewPage />} />
            <Route path="progress" element={<EmployeeProgressPage />} />
            <Route path="deadlines" element={<EmployeeDeadlinesPage />} />
            <Route
              path="weekly-summary"
              element={<EmployeeWeeklySummaryPage />}
            />
            <Route path="tasks" element={<EmployeeTasksPage />} />
            <Route path="*" element={<Navigate to="/employee" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
