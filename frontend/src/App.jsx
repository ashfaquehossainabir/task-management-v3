import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import EmployeeDashboard from "./dashboards/EmployeeDashboard";
import Login from "./pages/Login";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  const isAdmin = user.role === "leader" || user.role === "manager";
  const homePath = isAdmin ? "/admin" : "/employee";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homePath} replace />} />

      <Route
        path="/admin/*"
        element={
          isAdmin ? <AdminDashboard /> : <Navigate to={homePath} replace />
        }
      />

      <Route
        path="/employee/*"
        element={
          !isAdmin ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to={homePath} replace />
          )
        }
      />

      <Route path="*" element={<Navigate to={homePath} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            borderRadius: "10px",
          },
        }}
      />

      <BrowserRouter>
        <AuthProvider>
          <TaskProvider>
            <AppContent />
          </TaskProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}