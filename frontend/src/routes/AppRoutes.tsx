import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Roadmap from "../pages/Roadmap";
import TaskDetails from "../pages/TaskDetails";
import Progress from "../pages/Progress";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import AdminTasks from "../pages/AdminTasks";
import CreateTask from "../pages/CreateTask";
import EditTask from "../pages/EditTask";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/protectedRoute";
import AdminProfile from "../pages/AdminProfile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Learner routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["learner"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute allowedRoles={["learner"]}>
            <Roadmap />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:taskId"
        element={
          <ProtectedRoute allowedRoles={["learner"]}>
            <TaskDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/progress"
        element={
          <ProtectedRoute allowedRoles={["learner"]}>
            <Progress />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["learner"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tasks"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tasks/new"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateTask />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tasks/:taskId/edit"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditTask />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;