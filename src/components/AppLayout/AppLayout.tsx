import { useState } from "react";
import { Outlet } from "react-router";

import AppNavbar from "../AppNavbar/AppNavbar";
import Sidebar from "../Sidebar/Sidebar";

import "./AppLayout.css";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 992,
  );

  return (
    <div className="dashboard-shell">
      <AppNavbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((isOpen) => !isOpen)}
      />
      <div className={`dashboard-page${sidebarOpen ? " sidebar-open" : ""}`}>
        <Sidebar isOpen={sidebarOpen} />
        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
