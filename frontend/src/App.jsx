import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TasksPage from "./pages/TasksPage";
import LogsPage from "./pages/LogsPage";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#0a0f1a] text-gray-200">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
