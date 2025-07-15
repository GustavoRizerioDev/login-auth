import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import TaskDashboard from "./pages/TaskDashboard";

export default function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <div className="fade-in">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/tasks" element={<TaskDashboard />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
