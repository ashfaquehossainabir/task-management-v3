import { AlarmClock, PartyPopper, UserCircle2, CalendarDays } from "lucide-react";
import { useTasks } from "../../context/TaskContext";

const isTomorrow = (dateString) => {
  if (!dateString) return false;

  const deadline = new Date(dateString);
  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    deadline.getFullYear() === tomorrow.getFullYear() &&
    deadline.getMonth() === tomorrow.getMonth() &&
    deadline.getDate() === tomorrow.getDate()
  );
};

export default function AdminDeadlinesPage() {
  const { tasks } = useTasks();

  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  const upcomingTasks = tasks.filter((task) => {
    if (!task.deadline) return false;

    const deadline = new Date(task.deadline);

    return (
      task.status !== "done" &&
      deadline >= today &&
      deadline <= threeDaysLater
    );
  });

  const upcomingTasksByEmployee = upcomingTasks.reduce((acc, task) => {
    const employee = task.assignedTo || "Unassigned";

    if (!acc[employee]) {
      acc[employee] = [];
    }

    acc[employee].push(task);
    return acc;
  }, {});

  return (
    <section className="dashboard-section" style={{ marginBottom: "16px" }}>
      <div className="employee-breakdown">
        <h3>
          <AlarmClock
            size={18}
            strokeWidth={2.3}
            style={{ verticalAlign: "-3px", marginRight: "8px" }}
          />
          Tasks Due in Next 3 Days
        </h3>

        {Object.keys(upcomingTasksByEmployee).length === 0 ? (
          <div className="no-task-box">
            <p className="empty-text">
              <PartyPopper
                size={16}
                strokeWidth={2.2}
                style={{ verticalAlign: "-3px", marginRight: "6px" }}
              />
              No urgent deadlines
            </p>
          </div>
        ) : (
          <div className="employee-grid due-task">
            {Object.entries(upcomingTasksByEmployee).map(
              ([employee, tasks]) => (
                <div key={employee} className="employee-card">
                  <h4>
                    <UserCircle2
                      size={16}
                      strokeWidth={2.2}
                      style={{ verticalAlign: "-3px", marginRight: "6px", color: "#6366f1" }}
                    />
                    {employee}
                  </h4>

                  <div
                    className="employee-stats deadline-list"
                    style={{
                      overflowY: "auto",
                      maxHeight: "130px",
                      gap: "8px",
                      paddingRight: "4px",
                    }}
                  >
                    {tasks.map((task) => (
                      <div
                        key={task._id}
                        style={{
                          background: isTomorrow(task.deadline)
                            ? "#fee2e2"
                            : "#fff7ed",
                          border: isTomorrow(task.deadline)
                            ? "1px solid #ef4444"
                            : "1px solid #fcd34d",
                          padding: "8px 10px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <b>{task.title}</b>

                        {isTomorrow(task.deadline) && (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "8px",
                              background: "#ef4444",
                              color: "#fff",
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "999px",
                            }}
                          >
                            DEADLINE TOMORROW
                          </span>
                        )}

                        {!isTomorrow(task.deadline) && (
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "8px",
                              background: "#d8a601",
                              color: "#fff",
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "999px",
                            }}
                          >
                            EXTEND REQUIRED
                          </span>
                        )}

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            margin: "10px 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <CalendarDays size={13} strokeWidth={2.2} />
                          {new Date(task.deadline).toDateString()}
                        </div>

                        <div className={`priority ${task.priority}`}>
                          {task.priority}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
