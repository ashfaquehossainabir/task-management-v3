import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();
const API = `${API_BASE_URL}/api/tasks`;
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    axios
      .get(API, authHeaders())
      .then((res) => setTasks(res.data))
      .catch(() => setTasks([]));
  }, [user]);

  const addTask = async (task) => {
    const res = await axios.post(API, task);
    setTasks((prev) => [...prev, res.data]);
  };

  const updateTaskStatus = async (id, status) => {
    const res = await axios.patch(`${API}/${id}`, { status });
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? res.data : t))
    );
  };

  const updateTask = async (task) => {
    const res = await axios.put(`${API}/${task._id}`, task);

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? res.data : t))
    );
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTaskStatus, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);