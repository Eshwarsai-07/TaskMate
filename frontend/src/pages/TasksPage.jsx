import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import TaskModal from "../components/TaskModal";
import { api } from "../api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/api/tasks", {
        params: { page, limit, q: search || undefined },
      });
      setTasks(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // optional toggle logic can be added here if needed

  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  // when search text changes from Header, reset to page 1 via setSearch in prop

  return (
    <>
      <Header
        refreshTasks={() => {
          setPage(1);
          fetchTasks();
        }}
        onSearchChange={(q) => {
          setPage(1);
          setSearch(q);
        }}
      />
      {editingTask && (
        <TaskModal
          onClose={() => setEditingTask(null)}
          onAdded={fetchTasks}
          task={editingTask}
        />
      )}
      <div className="p-4 sm:p-6">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet...</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0d1117]">
            <div className="min-w-[800px] grid grid-cols-12 px-4 sm:px-6 py-3 text-sm text-gray-400 border-b border-gray-800">
              <div className="col-span-2">ID</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Created At</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {tasks
              .filter((t) =>
                `${t.title} ${t.description}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((task, idx) => (
                <motion.div
                  key={task._id}
                  whileHover={{ backgroundColor: "#0f1420" }}
                  className="min-w-[800px] grid grid-cols-12 items-center px-4 sm:px-6 py-4 border-b border-gray-800 text-sm"
                >
                  <div className="col-span-2 text-gray-300">{(page - 1) * limit + idx + 1}</div>
                  <div className="col-span-3 text-gray-200">{task.title}</div>
                  <div className="col-span-4 text-gray-400">
                    {task.description}
                  </div>
                  <div className="col-span-2 text-gray-400 whitespace-nowrap">
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                  <div className="col-span-1">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="inline-flex items-center h-8 px-3 rounded-full text-xs border border-blue-700 bg-blue-600 text-blue-50 shadow-[inset_0_-1px_0_rgba(0,0,0,.25)] hover:bg-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="inline-flex items-center h-8 px-3 rounded-full text-xs border border-rose-700 bg-rose-600 text-rose-50 shadow-[inset_0_-1px_0_rgba(0,0,0,.25)] hover:bg-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            <div className="min-w-[800px] flex items-center justify-between px-4 sm:px-6 py-3 text-sm text-gray-400">
              <span>
                Showing {tasks.length} of {total} tasks
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-gray-800 bg-[#0b0f15] hover:bg-[#0f1420]"
                >
                  Prev
                </button>
                <span className="px-3 py-1 rounded-md border border-gray-800 text-gray-300 bg-[#0b0f15]">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  className="px-3 py-1 rounded-md border border-gray-800 bg-[#0b0f15] hover:bg-[#0f1420]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
