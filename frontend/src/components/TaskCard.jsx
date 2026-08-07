import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Eye, CalendarDays, AlertTriangle, DollarSign } from "lucide-react";
import EditTaskModal from "./EditTaskModal";
import ConfirmModal from "./ConfirmModal";
import TaskDetailsModal from "./TaskDetailsModal";
import { formatCurrency, formatCurrencyFull } from "../utils/formatCurrency";
import { getAvatarColor } from "../utils/avatarColor";
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
  const projectValue = formatCurrency(task.projectValue);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <div className={`task-card ${urgency}`}>
      {/* Header: title + priority */}
      <div className="task-card-header">
        <h4 className="task-title" title={task.title}>{task.title}</h4>
        <span className={`priority-badge priority-${task.priority}`}>
          <span className="priority-dot" />
          {task.priority}
        </span>
      </div>

      {/* Identity: who it's for + when it's due */}
      {(user.role !== "employee" || task.deadline) && (
        <div className="task-info">
          {user.role !== "employee" && (
            <div className="assignee-row">
              <span
                className="avatar"
                aria-hidden="true"
                style={{ background: getAvatarColor(task.assignedTo) }}
              >
                {getInitials(task.assignedTo)}
              </span>
              <span className="assignee-text">
                <span className="info-label">Assigned to</span>
                <span className="info-value">{task.assignedTo}</span>
              </span>
            </div>
          )}

          {task.deadline && (
            <div className="deadline-row">
              <span className="info-row">
                <CalendarDays size={14} strokeWidth={2.2} className="meta-icon" />
                <span className="info-value">
                  {new Date(task.deadline).toLocaleDateString("en-GB")}
                </span>
              </span>

              <span className={`remaining-pill ${isRemainingOverdue ? "is-overdue" : ""}`}>
                {remaining}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Signature: project value stands out as its own stat */}
      {projectValue && (
        <div className="project-value-chip" title={formatCurrencyFull(task.projectValue)}>
          <span className="pv-icon">
            <DollarSign size={15} strokeWidth={2.6} />
          </span>
          <span className="pv-text">
            <span className="pv-label">Project value</span>
            <span className="pv-amount">{projectValue}</span>
          </span>
        </div>
      )}

      <div className="task-divider" />

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
