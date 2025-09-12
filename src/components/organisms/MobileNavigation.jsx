import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MobileNavigation = () => {
  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Clock", href: "/time-clock", icon: "Clock" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Time Off", href: "/time-off", icon: "Plane" },
    { name: "More", href: "/announcements", icon: "Menu" },
  ];

  return (
    <div className="lg:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 safe-area-pb z-40">
        <nav className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "text-primary-600"
                    : "text-secondary-500 hover:text-secondary-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute inset-0 bg-primary-50 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className="relative z-10 mb-1"
                  />
                  <span className="relative z-10 text-xs font-medium">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;