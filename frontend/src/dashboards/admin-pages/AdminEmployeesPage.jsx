import { useState } from "react";
import { UserPlus, User, X } from "lucide-react";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import TaskCard from "../../components/TaskCard";
import RegisterUser from "../../pages/RegisterUser";

export default function AdminEmployeesPage() {
  const { tasks } = useTasks();
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = [
    ...new Set(tasks.map((task) => task.assignedTo).filter(Boolean)),
  ];

  const employeeTasks = selectedEmployee
    ? tasks.filter((task) => task.assignedTo === selectedEmployee)
    : [];

  return (
    <>
      {user.role === "manager" && (
        <section className="dashboard-section">
          <button className="add-task-btn icon-btn" onClick={() => setShowRegister(true)}>
            <UserPlus size={17} strokeWidth={2.4} />
            Create User
          </button>
        </section>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create User</h3>
              <button
                className="close-btn"
                onClick={() => setShowRegister(false)}
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <RegisterUser closeModal={() => setShowRegister(false)} />
          </div>
        </div>
      )}

      <div className="employee-panel">
        <h3>Employees</h3>

        <div className="employee-list">
          {employees.map((emp) => (
            <button
              key={emp}
              className={`employee-btn icon-btn ${
                selectedEmployee === emp ? "active" : ""
              }`}
              onClick={() =>
                setSelectedEmployee(selectedEmployee === emp ? null : emp)
              }
            >
              <User size={15} strokeWidth={2.3} />
              {emp}
            </button>
          ))}
        </div>
      </div>

      <section className="dashboard-section">
        {selectedEmployee ? (
          <>
            <h3 style={{ marginBottom: "16px" }}>
              Tasks for {selectedEmployee}
            </h3>

            {employeeTasks.length === 0 ? (
              <p className="empty-text">No tasks assigned</p>
            ) : (
              <div className="task-grid">
                {employeeTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="no-task-box">
            <p className="empty-text">👆 Click an employee to view tasks</p>
          </div>
        )}
      </section>
    </>
  );
}
