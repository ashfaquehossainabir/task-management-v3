import { ListChecks, ListTodo, Clock3, CheckCircle2, PartyPopper } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { getAssignedTasks } from "./employeeHelpers";
import { formatCount } from "../../utils/formatCount";

export default function EmployeeOverviewPage() {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const assignedTasks = getAssignedTasks(tasks, user);

  const totalTasks = assignedTasks.length;
  const todoTasks = assignedTasks.filter((t) => t.status === "todo").length;
  const inProgressTasks = assignedTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const doneTasks = assignedTasks.filter((t) => t.status === "done").length;

  const pendingTasks = assignedTasks.filter((t) => t.status !== "done");

  return (
    <>
      <section className="dashboard-section">
        <span className="eyebrow" style={{ marginBottom: "14px", display: "block" }}>
          Overview
        </span>
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-icon">
              <ListChecks size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>Total Tasks</h3>
              <p>{formatCount(totalTasks)}</p>
            </div>
          </div>

          <div className="stat-card todo">
            <span className="stat-icon">
              <ListTodo size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>To-Do</h3>
              <p>{formatCount(todoTasks)}</p>
            </div>
          </div>

          <div className="stat-card in-progress">
            <span className="stat-icon">
              <Clock3 size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>In Progress</h3>
              <p>{formatCount(inProgressTasks)}</p>
            </div>
          </div>

          <div className="stat-card done">
            <span className="stat-icon">
              <CheckCircle2 size={19} strokeWidth={2.3} />
            </span>
            <div>
              <h3>Done</h3>
              <p>{formatCount(doneTasks)}</p>
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
        <div className="employee-task-panel" style={{ maxWidth: "none" }}>
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
            <div className="employee-task-list">
              {pendingTasks.map((task) => (
                <div key={task._id} className="employee-task-item">
                  <h4>{task.title}</h4>
                  <span className={`badge ${task.status}`}>
                    {task.status === "todo" ? "To-Do" : "In-Progress"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
