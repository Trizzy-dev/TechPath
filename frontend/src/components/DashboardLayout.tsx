import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type DashboardLayoutProps = {
  children: ReactNode;
  isAdmin?: boolean;
};

export default function DashboardLayout({
  children,
  isAdmin = false,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = isAdmin
    ? [
        { label: "Dashboard", to: "/admin" },
        { label: "Manage Tasks", to: "/admin/tasks" },
        { label: "Create Task", to: "/admin/tasks/new" },
        { label: "My Profile", to: "/admin/profile" },
      ]
    : [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Learning Roadmap", to: "/roadmap" },
        { label: "My Progress", to: "/progress" },
        { label: "Profile", to: "/profile" },
      ];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40"
          aria-label="Close navigation overlay"
        />
      )}

      {/* Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
          <NavLink
            to={isAdmin ? "/admin" : "/dashboard"}
            onClick={() => setMenuOpen(false)}
            className="text-xl font-bold text-blue-600"
          >
            TechPath
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="text-2xl text-gray-500 hover:text-gray-900"
            aria-label="Close navigation menu"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {isAdmin ? "Administration" : "Learning"}
          </p>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin" || link.to === "/dashboard"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t p-4">
          <p className="truncate text-sm font-semibold text-gray-800">
            {user?.name || "User"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {isAdmin ? "Administrator" : "Learner"}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full rounded-lg border px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 hover:bg-gray-100"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          <p className="hidden text-sm font-medium text-gray-500 sm:block">
            {isAdmin ? "Admin Portal" : "Your Learning Space"}
          </p>

          <p className="truncate text-sm font-medium text-gray-700">
            {user?.name || "Welcome"}
          </p>
        </header>

        {children}
      </div>
    </div>
  );
}