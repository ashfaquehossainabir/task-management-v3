import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Users,
  ArrowRight,
  ListChecks,
  ListTodo,
  Clock3,
  CheckCircle2,
  PartyPopper,
  UserCircle2,
} from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";

export default function AdminOverviewPage() {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const isManager = user.role === "manager";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const usersRes = await axios.get(
          `${API_BASE_URL}/api/stats/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const tasksRes = await axios.get(
          `${API_BASE_URL}/api/stats/tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserCount(usersRes.data.count);
        setTaskCount(tasksRes.data.count);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!isManager) return;

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const employeeUsers = (
          Array.isArray(res.data) ? res.data : []
        ).filter((u) => u.role === "employee");

        setEmployees(employeeUsers);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };

    fetchEmployees();
  }, [isManager]);

  const todoCount = tasks.filter((task) => task.status === "todo").length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const doneCount = tasks.filter((task) => task.status === "done").length;

  const pendingTasks = tasks.filter((task) => task.status !== "done");

  return (
    <>
      <section className="dashboard-section">
        <span className="eyebrow" style={{ marginBottom: "14px", display: "block" }}>
          Overview
        </span>
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-icon">
              <Users size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>Total Users</h3>
              <p>{userCount}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              <ListChecks size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>Total Tasks</h3>
              <p>{taskCount}</p>
            </div>
          </div>

          <div className="stat-card todo">
            <span className="stat-icon">
              <ListTodo size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>To-Do Tasks</h3>
              <p>{todoCount}</p>
            </div>
          </div>

          <div className="stat-card in-progress">
            <span className="stat-icon">
              <Clock3 size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>In-Progress Tasks</h3>
              <p>{inProgressCount}</p>
            </div>
          </div>

          <div className="stat-card done">
            <span className="stat-icon">
              <CheckCircle2 size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>Done Tasks</h3>
              <p>{doneCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===============================
          All Pending Tasks
      ================================ */}
      <section className="dashboard-section">
        <span className="eyebrow" style={{ marginBottom: "14px", display: "block" }}>
          Pending work
        </span>
        <div className="pending-task-panel" style={{ maxWidth: "none" }}>
          <h3>Pending Tasks ({pendingTasks.length})</h3>

          {pendingTasks.length === 0 ? (
            <p className="empty-text">
              <PartyPopper
                size={16}
                strokeWidth={2.2}
                style={{ verticalAlign: "-3px", marginRight: "6px" }}
              />
              No pending tasks
            </p>
          ) : (
            <div className="pending-task-list">
              {pendingTasks.map((task) => (
                <div key={task._id} className="pending-task-item">
                  <div>
                    <h4>{task.title}</h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        margin: "4px 0 0",
                      }}
                    >
                      Assigned to: <b>{task.assignedTo || "Unassigned"}</b>
                    </p>
                    <span className={`badge ${task.status}`}>
                      {task.status === "todo" ? "To-Do" : "In-Progress"}
                    </span>
                  </div>

                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===============================
          Employee Users (Manager only)
      ================================ */}
      {isManager && (
        <section className="dashboard-section">
          <span className="eyebrow" style={{ marginBottom: "14px", display: "block" }}>
            Team
          </span>
          <div className="employee-breakdown">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h3>
                <Users
                  size={18}
                  strokeWidth={2.2}
                  style={{ verticalAlign: "-3px", marginRight: "8px" }}
                />
                Employee Users ({employees.length})
              </h3>

              <Link to="/admin/users" className="icon-btn" style={{ textDecoration: "none" }}>
                Manage Users
                <ArrowRight size={15} strokeWidth={2.4} />
              </Link>
            </div>

            {employees.length === 0 ? (
              <p className="empty-text" style={{ marginTop: "12px" }}>
                No employee accounts yet
              </p>
            ) : (
              <div className="employee-grid task-breakdown" style={{ marginTop: "16px" }}>
                {employees.map((emp) => (
                  <div key={emp._id} className="employee-card">
                    <h4>
                      <UserCircle2
                        size={16}
                        strokeWidth={2.2}
                        style={{ verticalAlign: "-3px", marginRight: "6px", color: "#6366f1" }}
                      />
                      {emp.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        margin: "4px 0 8px",
                      }}
                    >
                      {emp.email}
                    </p>
                    <span
                      className={emp.isActive === false ? "status-inactive" : "status-active"}
                    >
                      {emp.isActive === false ? "● Inactive" : "● Active"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
