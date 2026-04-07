import { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Overview" },
    { path: "/products", icon: Package, label: "Products" },
    { path: "/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/contact", icon: MessageSquare, label: "Contact Us" },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#FAF5F5' }}>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-white shadow-lg transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 border-b" style={{ borderColor: '#fef200' }}>
          <h2 className="text-2xl">Dashboard</h2>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-black"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: '#fef200' } : {}
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="text-sm text-gray-600">
            Welcome to your dashboard
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
