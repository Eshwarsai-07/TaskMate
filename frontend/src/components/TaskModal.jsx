import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "../api";

export default function TaskModal({ onClose, onAdded, task }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = task ? "PUT" : "POST";
      const url = task ? `/api/tasks/${task._id}` : `/api/tasks`;

      // simple input sanitization: strip HTML tags
      const stripTags = (s) => s.replace(/<[^>]*>/g, "");
      const payload = {
        title: stripTags(title).slice(0, 100),
        description: stripTags(description).slice(0, 100),
      };
      if (method === "POST") {
        await api.post(url, payload);
      } else {
        await api.put(url, payload);
      }
      onAdded && onAdded();
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#161b22] p-4 sm:p-6 rounded-2xl w-full max-w-md sm:max-w-lg border border-gray-700 mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-400">
            {task ? "Edit Task" : "Add New Task"}
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 mb-3 focus:border-blue-500 outline-none"
            required
          />
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 100))}
            maxLength={100}
            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 mb-2 h-24 focus:border-blue-500 outline-none"
            required
          />
          <div className="text-right text-xs text-gray-500 mb-2">{description.length}/100</div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : task ? "Update Task" : "Add Task"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
