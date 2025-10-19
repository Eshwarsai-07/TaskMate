import { useEffect, useState } from "react";
import Header from "../components/Header";
import { api } from "../api";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/api/logs", { params: { page, limit } });
      setLogs(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const badgeClasses = (action) => {
    const base =
      "inline-flex items-center h-8 px-3 rounded-full text-xs border shadow-[inset_0_-1px_0_rgba(0,0,0,.25)]";
    if (/create/i.test(action)) {
      return `${base} bg-emerald-600 text-emerald-50 border-emerald-700`;
    }
    if (/update/i.test(action)) {
      return `${base} bg-amber-600 text-amber-50 border-amber-700`;
    }
    if (/delete/i.test(action)) {
      return `${base} bg-rose-600 text-rose-50 border-rose-700`;
    }
    return `${base} bg-gray-700 text-gray-200 border-gray-600`;
  };

  return (
    <>
      <Header refreshTasks={null} />
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0d1117]">
          <div className="min-w-[900px] grid grid-cols-12 px-4 sm:px-6 py-3 text-sm text-gray-400 border-b border-gray-800">
            <div className="col-span-3">Timestamp</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-2">Task ID</div>
            <div className="col-span-4">Updated Content</div>
            <div className="col-span-1">Notes</div>
          </div>

          {logs.length === 0 ? (
            <div className="px-4 sm:px-6 py-6 text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className="min-w-[900px] grid grid-cols-12 items-center px-4 sm:px-6 py-4 border-b border-gray-800 text-sm"
              >
                <div className="col-span-3 text-gray-300 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div className="col-span-2 whitespace-nowrap min-w-[120px]">
                  <span className={badgeClasses(log.action)}>
                    {log.action || "—"}
                  </span>
                </div>
                <div className="col-span-2 text-gray-300 whitespace-nowrap min-w-[90px]">
                  {(page - 1) * limit + i + 1}
                </div>
                <div className="col-span-4">
                  {log.updatedContent ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(log.updatedContent).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex max-w-full items-center h-8 px-3 rounded-full text-xs border border-gray-700 text-gray-300 bg-[#0b0f15] truncate"
                          title={`${k}: ${v}`}
                        >
                          {k}: "{String(v)}"
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
                <div className="col-span-1 text-gray-500">—</div>
              </div>
            ))
          )}

          <div className="flex items-center justify-between px-4 sm:px-6 py-3 text-sm text-gray-400">
            <span>Showing {logs.length} of {total} logs</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-md border border-gray-800 bg-[#0b0f15] hover:bg-[#0f1420]"
              >
                Prev
              </button>
              <span className="px-3 py-1 rounded-md border border-gray-800 text-gray-300 bg-[#0b0f15]">Page {page}</span>
              <button
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                className="px-3 py-1 rounded-md border border-gray-800 bg-[#0b0f15] hover:bg-[#0f1420]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
