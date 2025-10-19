import { Plus, Search, ClipboardList, Clock3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import TaskModal from "./TaskModal";

export default function Header({ refreshTasks, onSearchChange }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <header className="px-4 sm:px-6 py-4 border-b border-gray-800 bg-[#0d1117]/70 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {pathname === "/" ? (
              <ClipboardList size={18} className="text-blue-400" />
            ) : (
              <Clock3 size={18} className="text-blue-400" />
            )}
            <h1 className="text-xl font-semibold text-gray-200">
              {pathname === "/" ? "Tasks" : "Audit Logs"}
            </h1>
            <span className="ml-3 text-xs text-gray-400 border border-gray-700 rounded-md px-2 py-0.5">
              v1.0
            </span>
          </div>

          {pathname === "/" && (
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus size={18} /> Create Task
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full text-sm border ${
                pathname === "/"
                  ? "text-blue-300 border-blue-900 bg-blue-500/10"
                  : "text-gray-400 border-gray-800 hover:text-gray-300"
              }`}
            >
              Tasks
            </Link>
            <Link
              to="/logs"
              className={`px-3 py-1.5 rounded-full text-sm border ${
                pathname === "/logs"
                  ? "text-blue-300 border-blue-900 bg-blue-500/10"
                  : "text-gray-400 border-gray-800 hover:text-gray-300"
              }`}
            >
              Audit Logs
            </Link>
          </div>

          {typeof onSearchChange === "function" && (
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title or description"
                className="w-full bg-[#0b0f15] text-gray-300 border border-gray-800 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
          )}
        </div>
      </header>

      {open && (
        <TaskModal
          onClose={() => setOpen(false)}
          onAdded={refreshTasks}
          task={null}
        />
      )}
    </>
  );
}
