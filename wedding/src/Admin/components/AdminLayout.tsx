import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function LayoutAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen overflow-y-auto bg-white shadow-md">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          closeMobileSidebar={() => setIsMobileOpen(false)}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 bg-white shadow-md">
        <Header
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          toggleMobileSidebar={() => setIsMobileOpen(true)}
        />
        </div>
        <main className="p-4 bg-gray-100 flex-1 overflow-auto max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
