import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Eye, User, CalendarDays, AlertTriangle } from "lucide-react";
import EditTaskModal from "./EditTaskModal";
import ConfirmModal from "./ConfirmModal";
import TaskDetailsModal from "./TaskDetailsModal";
import "./TaskCard.css";

export default function TaskCard({ task }) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "done";

  const canEdit = user.role === "leader" || user.role === "manager";
  const isEmployee = user.role === "employee";

  const getRemainingDays = (deadline) => {
    if (!deadline) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "⏰ Due today";
    if (diffDays === 1) return "⏳ 1 day left";
    if (diffDays > 1) return `⏳ ${diffDays} days left`;

    return `⚠ Overdue by ${Math.abs(diffDays)} days`;
  };

  const getDeadlineUrgency = (deadline) => {
    if (!deadline) return "normal";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "overdue";
    if (diffDays <= 1) return "urgent";
    if (diffDays < 3) return "warning";

    return "normal";
  };

  const urgency = getDeadlineUrgency(task.deadline);
  const remaining = getRemainingDays(task.deadline);
  const isRemainingOverdue = remaining && remaining.startsWith("⚠");

  return (
    <div className={`task-card ${urgency}`}>
      {/* Header: title + priority */}
      <div className="task-card-header">
        <h4 className="task-title" title={task.title}>{task.title}</h4>
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {/* Meta info: assigned to / deadline */}
      {(user.role !== "employee" || task.deadline) && (
        <div className="task-meta">
          {user.role !== "employee" && (
            <div className="task-meta-row">
              <User size={14} strokeWidth={2.2} className="meta-icon" />
              <span className="meta-text">
                <span className="meta-label">Assigned to</span> {task.assignedTo}
              </span>
            </div>
          )}

          {task.deadline && (
            <div className="task-meta-row">
              <CalendarDays size={14} strokeWidth={2.2} className="meta-icon" />
              <span className="meta-text">
                <span className="meta-label">Deadline</span>{" "}
                {new Date(task.deadline).toLocaleDateString("en-GB")}
              </span>
            </div>
          )}
        </div>
      )}

      {task.deadline && (
        <span className={`remaining-days ${isRemainingOverdue ? "is-overdue" : ""}`}>
          {remaining}
        </span>
      )}

      {/* Status + overdue badge */}
      <div className="task-card-footer-row">
        <div className={`status-badge status-${task.status}`}>
          <strong className="badge-label">Status</strong>
          {user.role === "employee" ? (
            <select
              value={task.status}
              onChange={(e) =>
                updateTaskStatus(task._id, e.target.value)
              }
              aria-label="Update task status"
            >
              <option value="todo">To-Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          ) : (
            <span className="status-value">{task.status}</span>
          )}
        </div>

        {isOverdue && (
          <span className="overdue-badge">
            <AlertTriangle size={12} strokeWidth={2.4} />
            Overdue
          </span>
        )}
      </div>

      {/* Leader + Manager only */}
      {canEdit && (
        <div className="task-actions">
          <button className="edit-btn icon-btn" onClick={() => setShowEdit(true)}>
            <Pencil size={14} strokeWidth={2.4} />
            <span>Edit</span>
          </button>

          <button
            className="delete-btn icon-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={14} strokeWidth={2.4} />
            <span>Delete</span>
          </button>

          <button
            className="view-btn icon-btn"
            onClick={() => setShowDetails(true)}
          >
            <Eye size={14} strokeWidth={2.4} />
            <span>View</span>
          </button>
        </div>
      )}

      {/* Employee only */}
      {isEmployee && (
        <div className="task-actions">
          <button
            className="view-btn icon-btn"
            onClick={() => setShowDetails(true)}
          >
            <Eye size={14} strokeWidth={2.4} />
            <span>View Details</span>
          </button>
        </div>
      )}

      {showEdit && (
        <EditTaskModal
          task={task}
          closeModal={() => setShowEdit(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Task?"
          message={`Are you sure you want to delete "${task.title}"?`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            try {
              await deleteTask(task._id);
              toast.success("Task deleted successfully 🗑️");
            } catch (err) {
              toast.error("Failed to delete task ❌");
            } finally {
              setShowDeleteConfirm(false);
            }
          }}
        />
      )}

      {showDetails && (
        <TaskDetailsModal
          task={task}
          closeModal={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}
