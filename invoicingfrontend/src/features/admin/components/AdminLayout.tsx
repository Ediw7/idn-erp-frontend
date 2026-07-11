import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import {
  LogOut,
  Users,
  LayoutDashboard,
  Settings,
  UserPlus,
  Shield,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenu = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },

    {
      label: "Setup User",
      path: "/admin/setup-user",
      icon: <UserPlus size={18} />,
    },
    {
      label: "Setup User Permission",
      path: "/admin/setup-permission",
      icon: <Shield size={18} />,
    },
    {
      label: "Database Connection",
      path: "/admin/database",
      icon: <Settings size={18} />,
    },
    {
      label: "Backup Data",
      path: "/admin/backup",
      icon: <Settings size={18} />,
    },
    {
      label: "Restore Data",
      path: "/admin/restore",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar - Admin Theme (Dark Red/Slate) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-md z-10 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700 bg-slate-950 flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded text-white">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              ADMIN
            </h1>
            <p className="text-xs text-red-400">EDI Accounting System</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1">
            <li className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Administration
            </li>
            {adminMenu.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin/") ? "bg-slate-800 border-l-4 border-red-500 font-medium text-white" : "border-l-4 border-transparent text-slate-300 hover:text-white"}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f4f6f8]">
        {/* Top Header */}
        <header className="h-14 bg-white shadow-sm border-b px-6 flex items-center justify-between z-0">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {location.pathname === "/admin"
              ? "Admin Dashboard"
              : location.pathname.split("/").pop()?.replace(/-/g, " ")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[11px] text-red-600 font-bold">SYSTEM ADMIN</p>
            </div>
            <div className="h-6 w-px bg-slate-300 mx-1"></div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content injected by React Router Outlet */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
