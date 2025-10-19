import { Home, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const navItems = [
    { name: "Tasks", icon: <Home size={20} />, path: "/" },
    { name: "Audit Logs", icon: <History size={20} />, path: "/logs" },
  ];

  return (
    <aside className="hidden md:flex md:w-64 bg-[#111827] border-r border-gray-800 flex-col p-4">
      <div className="flex items-center gap-2 text-2xl font-semibold mb-8 text-gray-200 tracking-wide">
        <span className="inline-flex h-5 w-5 border border-gray-600 rounded-sm items-center justify-center">
          <span className="h-3 w-3 bg-blue-500 rounded-sm" />
        </span>
        TaskMate
      </div>
      <nav className="space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all 
              ${
                pathname === item.path
                  ? "bg-[#0b3b4a] text-teal-200"
                  : "hover:bg-[#0f172a] hover:text-gray-200 text-gray-400"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
