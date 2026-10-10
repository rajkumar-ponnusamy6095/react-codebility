import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router";
import "./Sidebar.css";

interface SidebarProps { isOpen: boolean; }
const sidebarItems = [{ label: "Overview", path: "/dashboard", icon: "bi-grid-fill" }, { label: "Users", path: "/users", icon: "bi-people-fill" }];

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  return <aside id="dashboard-sidebar" className={`app-sidebar${isOpen ? " sidebar-open" : " sidebar-closed"}`} aria-hidden={!isOpen} inert={!isOpen} aria-label="Main navigation">
    <Link className="sidebar-brand" to="/dashboard" aria-label="Codebility home"><span className="sidebar-brand-mark"><i className="bi bi-layers-fill" /></span><span className="sidebar-brand-copy"><strong>Codebility</strong><small>WORKSPACE</small></span></Link>
    <div className="sidebar-workspace" aria-label="Current workspace"><span className="workspace-mark"><i className="bi bi-building" /></span><div className="workspace-details"><span className="workspace-caption">CURRENT WORKSPACE</span><div className="workspace-name">Admin Application</div></div><span className="workspace-status" aria-label="Online"><span className="workspace-status-dot" /></span></div>
    <Nav className="sidebar-nav" aria-label="Main menu"><span className="sidebar-nav-heading">MENU</span>{sidebarItems.map((item) => { const active = location.pathname === item.path || (item.path === "/users" && location.pathname.startsWith("/users/")); return <Nav.Link key={item.path} as={Link} to={item.path} className={`sidebar-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}><span className="sidebar-icon"><i className={`bi ${item.icon}`} /></span><span className="sidebar-label">{item.label}</span></Nav.Link>; })}</Nav>
    <div className="sidebar-footer"><span className="sidebar-footer-icon"><i className="bi bi-shield-check" /></span><span className="sidebar-footer-copy"><strong>Codebility Workspace</strong><small>Administration portal</small></span><span className="sidebar-footer-indicator" /></div>
  </aside>;
}
