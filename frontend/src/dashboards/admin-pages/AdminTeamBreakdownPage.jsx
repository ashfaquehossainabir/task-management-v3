import { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle2, Search, SearchX } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { API_BASE_URL } from "../../config/api";
import { formatCount } from "../../utils/formatCount";

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
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [employeeDepartments, setEmployeeDepartments] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const map = {};
        (Array.isArray(res.data) ? res.data : []).forEach((u) => {
          if (u.department) map[u.name] = u.department;
        });

        setEmployeeDepartments(map);
      } catch (error) {
        console.error("Failed to fetch employee departments", error);
      }
    };

    fetchUsers();
  }, []);

  const departmentOptions = [
    ...new Set(Object.values(employeeDepartments)),
  ].sort();

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
    ([employee]) => {
      const matchesQuery = !query || employee.toLowerCase().includes(query);
      const matchesDepartment =
        departmentFilter === "all" ||
        employeeDepartments[employee] === departmentFilter;

      return matchesQuery && matchesDepartment;
    }
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <div className="search-box" style={{ flex: 1, minWidth: "200px" }}>
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

              <select
                className="status-filter"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {searchQuery !== debouncedSearchQuery && (
              <span className="searching-indicator" style={{ marginTop: "10px" }}>
                Searching...
              </span>
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

                {employeeDepartments[employee] && (
                  <span className="department-chip">
                    {employeeDepartments[employee]}
                  </span>
                )}

                <div className="employee-stats">
                  <span className="todo">
                    To-Do: <b>{formatCount(stats.todo)}</b>
                  </span>

                  <span className="in-progress">
                    In-Progress: <b>{formatCount(stats.inProgress)}</b>
                  </span>

                  <span className="done">
                    Done: <b>{formatCount(stats.done)}</b>
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

