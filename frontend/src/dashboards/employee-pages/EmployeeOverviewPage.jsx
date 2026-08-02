import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { getAssignedTasks } from "./employeeHelpers";

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
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>

        <div className="stat-card todo">
          <h3>To-Do</h3>
          <p>{todoTasks}</p>
        </div>

        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <p>{inProgressTasks}</p>
        </div>

        <div className="stat-card done">
          <h3>Done</h3>
          <p>{doneTasks}</p>
        </div>
      </div>

      {/* ===============================
          All Pending Tasks
      ================================ */}
      <section className="dashboard-section" style={{ marginTop: "24px" }}>
        <div className="employee-task-panel" style={{ maxWidth: "none" }}>
          <h3>Pending Tasks ({pendingTasks.length})</h3>

          {pendingTasks.length === 0 ? (
            <p className="empty-text">🎉 No pending tasks</p>
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
