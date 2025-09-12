import React from "react";
import { useLocation } from "react-router-dom";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/time-clock":
        return "Time Clock";
      case "/schedule":
        return "Schedule";
      case "/time-off":
        return "Time Off";
      case "/announcements":
        return "Announcements";
      case "/profile":
        return "Profile";
      default:
        return "WorkHub";
    }
  };

  const getCurrentEmployee = () => {
    return {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: null
    };
  };

  const employee = getCurrentEmployee();

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">{getPageTitle()}</h1>
          <p className="text-sm text-secondary-600 mt-1">Welcome back, {employee.name.split(" ")[0]}!</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-secondary-400 hover:text-secondary-600 transition-colors">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-secondary-900">{employee.name}</p>
              <p className="text-xs text-secondary-600">Employee</p>
            </div>
            <Avatar 
              src={employee.avatar}
              fallback={employee.name.split(" ").map(n => n[0]).join("")}
              size="md"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;