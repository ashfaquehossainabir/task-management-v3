import { Doughnut } from "react-chartjs-2";
import { PartyPopper } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTasks } from "../../context/TaskContext";

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

    ctx.font = "700 40px Inter";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, centerX, centerY - 8);

    ctx.font = "500 14px Inter";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Completed", centerX, centerY + 18);

    ctx.font = "400 12px Inter";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Total: ${total}`, centerX, centerY + 36);

    ctx.restore();
  },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "75%",
  layout: { padding: 10 },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
        color: "#374151",
        font: { size: 13, weight: "600" },
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor: "#fff",
      bodyColor: "#e2e8f0",
      padding: 12,
      cornerRadius: 10,
      displayColors: false,
    },
  },
  animation: {
    animateScale: true,
    animateRotate: true,
    duration: 1200,
    easing: "easeOutQuart",
  },
};

export default function AdminAnalyticsPage() {
  const { tasks } = useTasks();

  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const pendingTasks = tasks.filter((task) => task.status !== "done").length;

  const pendingTaskList = tasks.filter(
    (task) => task.status === "todo" || task.status === "in-progress"
  );

  const taskChartData = {
    labels: ["Done Tasks", "Pending Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [doneTasks, pendingTasks],
        backgroundColor: ["#22c55e", "#f59e0b"],
        borderColor: ["#ffffff"],
        borderWidth: 4,
        hoverOffset: 18,
        borderRadius: 10,
      },
    ],
  };

  return (
    <section className="dashboard-section">
      <div className="chart-task-layout">
        {/* LEFT: Doughnut Chart */}
        <div className="chart-container">
          <h3>Task Completion</h3>

          <div className="chart-wrapper">
            <Doughnut
              data={taskChartData}
              options={chartOptions}
              plugins={[centerTextPlugin]}
            />
          </div>
        </div>

        {/* RIGHT: Pending Tasks */}
        <div className="pending-task-panel">
          <h3>Pending Tasks</h3>

          {pendingTaskList.length === 0 ? (
            <p className="empty-text">
              <PartyPopper size={16} strokeWidth={2.2} style={{ verticalAlign: "-3px", marginRight: "6px" }} />
              No pending tasks
            </p>
          ) : (
            <div className="pending-task-list">
              {pendingTaskList.map((task) => (
                <div key={task._id} className="pending-task-item">
                  <div>
                    <h4>{task.title}</h4>
                    <span className={`badge ${task.status}`}>
                      {task.status === "todo" ? "To-Do" : "In-Progress"}
                    </span>
                  </div>

                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
