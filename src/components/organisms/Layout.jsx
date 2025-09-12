import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileNavigation from "@/components/organisms/MobileNavigation";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex lg:w-64 lg:flex-col fixed lg:inset-y-0" />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <Header />
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default Layout;