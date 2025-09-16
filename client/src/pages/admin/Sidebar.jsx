// Sidebar Component
import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: "dashboard", label: "Dashboard", icon: <ChartNoAxesColumn size={22} /> },
    { to: "course", label: "Courses", icon: <SquareLibrary size={22} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md shadow-md p-6 sticky top-0 h-screen">
        <div className="space-y-4">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 
                  ${
                    isActive
                      ? "bg-teal-600 dark:bg-teal-500 text-white dark:text-gray-900 shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-teal-600 dark:hover:text-teal-400"
                  }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;