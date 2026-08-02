import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import TaskCard from "../../components/TaskCard";
import { getAssignedTasks } from "./employeeHelpers";

export default function EmployeeTasksPage() {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");

  const assignedTasks = getAssignedTasks(tasks, user);

  const filteredTasks =
    statusFilter === "all"
      ? assignedTasks
      : assignedTasks.filter((task) => task.status === statusFilter);

  return (
    <>
      <div className="task-filter-bar">
        {["all", "todo", "in-progress", "done"].map((status) => (
          <button
            key={status}
            className={`filter-btn ${
              statusFilter === status ? "active" : ""
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status === "all"
              ? "All"
              : status === "todo"
              ? "To-Do"
              : status === "in-progress"
              ? "In-Progress"
              : "Done"}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="no-task-box">
          <h3>📭 No tasks found</h3>
          <p>No tasks for this filter.</p>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </>
  );
}
