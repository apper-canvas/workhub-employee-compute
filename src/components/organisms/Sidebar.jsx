import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className = "" }) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Time Clock", href: "/time-clock", icon: "Clock" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Time Off", href: "/time-off", icon: "Plane" },
    { name: "Announcements", href: "/announcements", icon: "Megaphone" },
    { name: "Profile", href: "/profile", icon: "User" },
  ];

  return (
    <div className={`bg-white border-r border-secondary-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
            <ApperIcon name="Briefcase" className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary-900">WorkHub</h1>
            <p className="text-sm text-secondary-600">Employee Portal</p>
          </div>
        </div>
      </div>

      <nav className="px-3 pb-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-600"
                        : "text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900"
                    }`
                  }
                >
                  <ApperIcon
                    name={item.icon}
                    className={`mr-3 flex-shrink-0 transition-colors ${
                      isActive ? "text-primary-600" : "text-secondary-400 group-hover:text-secondary-600"
                    }`}
                    size={20}
                  />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;