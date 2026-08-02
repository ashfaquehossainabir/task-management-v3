import { useState, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import TaskForm from "../../components/TaskForm";
import TaskCard from "../../components/TaskCard";

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function AdminTasksPage() {
  const { tasks } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");

  const filterTasks = (taskList) => {
    return taskList.filter((task) => {
      const matchesTitle = task.title
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      return matchesTitle && matchesStatus;
    });
  };

  return (
    <>
      <section className="dashboard-section">
        <button className="add-task-btn icon-btn" onClick={() => setShowModal(true)}>
          <Plus size={18} strokeWidth={2.6} />
          Add Task
        </button>
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Task</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                x
              </button>
            </div>

            <TaskForm closeModal={() => setShowModal(false)} />
          </div>
        </div>
      )}

      <section className="dashboard-section task-filter-section" style={{ marginTop: "0px" }}>
        <div className="task-filter-bar">
          <div className="task-filter-container">
            {/* Search */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Search tasks by title..."
                className="task-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">
                <Search size={16} strokeWidth={2.2} />
              </span>
            </div>

            {/* Status Filter */}
            <div className="filter-dp">
              <select
                className="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              {searchQuery !== debouncedSearchQuery && (
                <span className="searching-indicator">Searching...</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>All Tasks</h3>

        {tasks.length === 0 ? (
          <div className="no-task-box">
            <h3>📭 No assigned tasks</h3>
            <p>Please wait until admin assigns a task.</p>
          </div>
        ) : (
          <div className="task-grid">
            {filterTasks(tasks).map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}

        {filterTasks(tasks).length === 0 && tasks.length > 0 && (
          <div className="no-task-box">
            <p className="empty-text">❌ No matching tasks found</p>
          </div>
        )}
      </section>
    </>
  );
}
