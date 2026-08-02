/* ===============================
   Shared helpers for employee pages
================================ */

export const daysUntilDeadline = (deadline) => {
  const today = new Date();
  const due = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 (Sun) → 6 (Sat)

  const diffToMonday = day === 0 ? -6 : 1 - day;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

export const getAssignedTasks = (tasks, user) =>
  tasks.filter((task) => task.assignedTo === user.name);
