import { UserCircle2 } from "lucide-react";
import { useTasks } from "../../context/TaskContext";

export default function AdminTeamBreakdownPage() {
  const { tasks } = useTasks();

  const employeeTaskMap = tasks.reduce((acc, task) => {
    const employee = task.assignedTo || "Unassigned";

    if (!acc[employee]) {
      acc[employee] = { todo: 0, inProgress: 0, done: 0 };
    }

    if (task.status === "todo") acc[employee].todo += 1;
    if (task.status === "in-progress") acc[employee].inProgress += 1;
    if (task.status === "done") acc[employee].done += 1;

    return acc;
  }, {});

  return (
    <section className="dashboard-section">
      <div className="employee-breakdown">
        <span className="eyebrow" style={{ marginBottom: "14px", display: "block" }}>
          Team
        </span>
        <h3>Employee-wise Task Breakdown</h3>

        {Object.keys(employeeTaskMap).length === 0 ? (
          <p className="empty-text">No task data available</p>
        ) : (
          <div className="employee-grid task-breakdown">
            {Object.entries(employeeTaskMap).map(([employee, stats]) => (
              <div key={employee} className="employee-card">
                <h4>
                  <UserCircle2
                    size={16}
                    strokeWidth={2.2}
                    style={{ verticalAlign: "-3px", marginRight: "6px", color: "#6366f1" }}
                  />
                  {employee}
                </h4>

                <div className="employee-stats">
                  <span className="todo">
                    To-Do: <b>{stats.todo}</b>
                  </span>

                  <span className="in-progress">
                    In-Progress: <b>{stats.inProgress}</b>
                  </span>

                  <span className="done">
                    Done: <b>{stats.done}</b>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
