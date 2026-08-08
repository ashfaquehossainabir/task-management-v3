import { CalendarRange } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { getAssignedTasks, getWeekRange } from "./employeeHelpers";

export default function EmployeeWeeklySummaryPage() {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const assignedTasks = getAssignedTasks(tasks, user);
  const { startOfWeek, endOfWeek } = getWeekRange();

  const weeklyTasks = assignedTasks.filter((task) => {
    if (!task.createdAt) return false;

    const createdDate = new Date(task.createdAt);
    return createdDate >= startOfWeek && createdDate <= endOfWeek;
  });

  const weeklyDone = weeklyTasks.filter((t) => t.status === "done").length;
  const weeklyPending = weeklyTasks.filter((t) => t.status !== "done").length;
  const weeklyTotal = weeklyTasks.length;

  const weeklyCompletion =
    weeklyTotal === 0 ? 0 : Math.round((weeklyDone / weeklyTotal) * 100);

  return (
    <section className="weekly-summary">
      <h3>
        <CalendarRange
          size={18}
          strokeWidth={2.3}
          style={{ verticalAlign: "-3px", marginRight: "8px" }}
        />
        Weekly Progress Summary
      </h3>

      {weeklyTotal === 0 ? (
        <p className="empty-text">No tasks created this week</p>
      ) : (
        <div className="weekly-cards">
          <div className="weekly-card done">
            <h4>Completed</h4>
            <p>{weeklyDone}</p>
          </div>

          <div className="weekly-card pending">
            <h4>Pending</h4>
            <p>{weeklyPending}</p>
          </div>

          <div className="weekly-card percent">
            <h4>Completion</h4>
            <p>{weeklyCompletion}%</p>
          </div>
        </div>
      )}
    </section>
  );
}
