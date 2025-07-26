import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

export default function LayoutAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Toaster />
      <div className="sticky top-0 h-screen overflow-y-auto bg-white shadow-md">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          closeMobileSidebar={() => setIsMobileOpen(false)}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden h-screen">
        {/* Header sticky luôn hiển thị */}
        <div className="sticky top-0 bg-white shadow-md z-10">
          <Header
            toggleSidebar={() => setIsCollapsed(!isCollapsed)}
            toggleMobileSidebar={() => setIsMobileOpen(true)}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Nội dung scroll bên dưới */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <main className="p-4 max-w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
