import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Bookmark, Shield, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { clearAuthToken } from "../lib/auth";

function SidebarLink({ to, icon: Icon, label }) {
  const loc = useLocation();
  const active = loc.pathname === to || loc.pathname.startsWith(to + "/");

  return (
    <Link className={`sidebar-link ${active ? "sidebar-link-active" : ""}`} to={to}>
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
}

// PUBLIC_INTERFACE
export default function AppLayout() {
  /** Authenticated app portal layout: left sidebar + main routed content. */
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="In-app sidebar">
        <div className="sidebar-brand">
          <div className="badge" style={{ borderColor: "rgba(245,158,11,0.35)" }}>
            Elite Explorer
          </div>
        </div>

        <nav className="sidebar-nav">
          <SidebarLink to="/app/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="/app/saved" icon={Bookmark} label="Saved Profiles" />
          <SidebarLink to="/app/settings" icon={Settings} label="Settings" />
          <SidebarLink to="/admin" icon={Shield} label="Admin" />
        </nav>

        <div className="sidebar-footer">
          <Button
            className="w-full"
            onClick={() => {
              clearAuthToken();
              window.location.href = "/";
            }}
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
