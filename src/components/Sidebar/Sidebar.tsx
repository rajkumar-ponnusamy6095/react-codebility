import {
  Nav,
} from "react-bootstrap";

import {
  Link,
  useLocation,
} from "react-router";

import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: "bi-grid-fill",
  },
  {
    label: "Users",
    path: "/users",
    icon: "bi-people-fill",
  },
  {
    label: "Companies",
    path: "/companies",
    icon: "bi-buildings-fill",
  },
  {
    label: "Account",
    path: "/account",
    icon: "bi-person-vcard-fill",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "bi-gear-fill",
  },
  {
    label: "Login",
    path: "/login",
    icon: "bi-box-arrow-in-right",
  },
  {
    label: "Register",
    path: "/register",
    icon: "bi-person-plus-fill",
  },
  {
    label: "Error",
    path: "/404",
    icon: "bi-exclamation-circle-fill",
  },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      id="dashboard-sidebar"
      className="app-sidebar"
      aria-hidden={!isOpen}
      inert={!isOpen}
    >

     
      {/* Workspace */}
      <div className="sidebar-workspace">
        <div className="workspace-name">
          Admin Application
        </div>

        <div className="workspace-environment">
          Production
        </div>

        <span className="workspace-arrow">
          <i className="bi bi-chevron-expand" aria-hidden="true" />
        </span>
      </div>

      {/* Navigation */}
      <Nav className="sidebar-nav flex-column">

        {sidebarItems.map((item) => {
          const isActive =
            location.pathname === item.path;

          return (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              className={
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <span className="sidebar-icon">
                <i className={`bi ${item.icon}`} aria-hidden="true" />
              </span>

              <span>
                {item.label}
              </span>
            </Nav.Link>
          );
        })}

      </Nav>

    </aside>
  );
}