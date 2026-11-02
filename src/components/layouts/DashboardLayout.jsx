import { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 md:ml-64">
        <Navbar onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* bg-gray-100 */}
        <main className="pt-16 p-7  min-h-screen no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;



