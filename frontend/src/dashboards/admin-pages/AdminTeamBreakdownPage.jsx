import { useState, useEffect } from "react";
import { UserCircle2, Search, SearchX } from "lucide-react";
import { useTasks } from "../../context/TaskContext";

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

export default function AdminTeamBreakdownPage() {
  const { tasks } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const query = debouncedSearchQuery.trim().toLowerCase();
  const filteredEmployeeEntries = Object.entries(employeeTaskMap).filter(
    ([employee]) => !query || employee.toLowerCase().includes(query)
  );

  return (
    <section className="dashboard-section">
      <div className="employee-breakdown">
        <span className="eyebrow" style={{ marginBottom: "14px", display: "block" }}>
          Team
        </span>
        <h3>Employee-wise Task Breakdown</h3>

        <div className="task-filter-bar">
          <div className="task-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search employee..."
                className="task-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">
                <Search size={16} strokeWidth={2.2} />
              </span>
            </div>

            {searchQuery !== debouncedSearchQuery && (
              <span className="searching-indicator">Searching...</span>
            )}
          </div>
        </div>

        {Object.keys(employeeTaskMap).length === 0 ? (
          <p className="empty-text">No task data available</p>
        ) : filteredEmployeeEntries.length === 0 ? (
          <div className="no-task-box">
            <p className="empty-text">
              <SearchX size={16} strokeWidth={2.2} style={{ verticalAlign: "-3px", marginRight: "6px" }} />
              No employees match your search
            </p>
          </div>
        ) : (
          <div className="employee-grid task-breakdown">
            {filteredEmployeeEntries.map(([employee, stats]) => (
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

