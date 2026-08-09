import { Doughnut } from "react-chartjs-2";
import { PartyPopper } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTasks } from "../../context/TaskContext";
import { useAuth } from "../../context/AuthContext";
import { getAssignedTasks } from "./employeeHelpers";
import { formatCount } from "../../utils/formatCount";

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea, data } = chart;
    if (!chartArea) return;

    const { left, right, top, bottom } = chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const dataset = data.datasets[0];
    const total = dataset.data.reduce((a, b) => a + b, 0);
    const done = dataset.data[0];
    const percent = total ? Math.round((done / total) * 100) : 0;

    ctx.save();
    ctx.font = "700 36px Inter";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, centerX, centerY - 8);

    ctx.font = "500 14px Inter";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Completed", centerX, centerY + 18);
    ctx.restore();
  },
};

const chartOptions = {
  cutout: "75%",
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      callbacks: {
        title: () => "",
        label: (context) => {
          const label = context.label || "";
          const value = context.parsed ?? 0;
          return `${label}: ${formatCount(value)}`;
        },
      },
    },
  },
};

export default function EmployeeProgressPage() {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const assignedTasks = getAssignedTasks(tasks, user);

  const todoTaskList = assignedTasks.filter((t) => t.status === "todo");
  const inProgressTaskList = assignedTasks.filter(
    (t) => t.status === "in-progress"
  );
  const doneTasks = assignedTasks.filter((t) => t.status === "done").length;
  const todoTasks = todoTaskList.length;
  const inProgressTasks = inProgressTaskList.length;

  const chartData = {
    labels: ["Done", "Pending"],
    datasets: [
      {
        data: [doneTasks, todoTasks + inProgressTasks],
        backgroundColor: ["#22c55e", "#f59e0b"],
        borderWidth: 4,
      },
    ],
  };

  return (
    <section className="employee-chart-layout">
      <div className="employee-chart">
        <h3>Task Progress</h3>
        <div className="chart-box">
          <Doughnut
            data={chartData}
            options={chartOptions}
            plugins={[centerTextPlugin]}
          />
        </div>
      </div>

      <div className="employee-task-panel">
        <h3>Pending Tasks</h3>

        {[...todoTaskList, ...inProgressTaskList].length === 0 ? (
          <p className="empty-text">
            <PartyPopper size={16} strokeWidth={2.2} style={{ verticalAlign: "-3px", marginRight: "6px" }} />
            No pending tasks
          </p>
        ) : (
          <div className="employee-task-list">
            {[...todoTaskList, ...inProgressTaskList].map((task) => (
              <div key={task._id} className="employee-task-item">
                <h4>{task.title}</h4>
                <span className={`badge ${task.status}`}>
                  {task.status === "todo" ? "To-Do" : "In-Progress"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
