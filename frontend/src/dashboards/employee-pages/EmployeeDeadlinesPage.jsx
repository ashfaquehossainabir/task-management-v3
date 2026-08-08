import { AlarmClock, PartyPopper, Timer } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { getAssignedTasks, daysUntilDeadline } from "./employeeHelpers";

export default function EmployeeDeadlinesPage() {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const assignedTasks = getAssignedTasks(tasks, user);

  const urgentTasks = assignedTasks.filter((task) => {
    if (!task.deadline) return false;

    const daysLeft = daysUntilDeadline(task.deadline);
    return daysLeft >= 0 && daysLeft <= 3 && task.status !== "done";
  });

  return (
    <section className="urgent-task-section">
      <h3>
        <AlarmClock
          size={18}
          strokeWidth={2.3}
          style={{ verticalAlign: "-3px", marginRight: "8px" }}
        />
        Upcoming Deadlines (Next 3 Days)
      </h3>

      {urgentTasks.length === 0 ? (
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
        <div className="urgent-task-list">
          {urgentTasks.map((task) => {
            const daysLeft = daysUntilDeadline(task.deadline);

            return (
              <div key={task._id} className="urgent-task-card">
                <div>
                  <h4>{task.title}</h4>
                  <p className="urgent-deadline">
                    <Timer
                      size={13}
                      strokeWidth={2.4}
                      style={{ verticalAlign: "-2px", marginRight: "4px" }}
                    />
                    {daysLeft === 0
                      ? "Due Today"
                      : `Due in ${daysLeft} day(s)`}
                  </p>
                </div>

                <span className={`badge ${task.status}`}>{task.status}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
