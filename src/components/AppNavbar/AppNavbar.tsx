import { Navbar, Container, Button } from "react-bootstrap";

import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import "./AppNavbar.css";

interface AppNavbarProps {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

export default function AppNavbar({
  sidebarOpen,
  onSidebarToggle,
}: AppNavbarProps) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`app-navbar${onSidebarToggle ? " dashboard-navbar" : ""}${sidebarOpen ? " sidebar-open" : ""}`}
    >
      <Container fluid={Boolean(onSidebarToggle)}>
        {onSidebarToggle && (
          <Button
            variant="link"
            className="sidebar-toggle"
            type="button"
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-controls="dashboard-sidebar"
            aria-expanded={sidebarOpen}
            onClick={onSidebarToggle}
          >
            <span className="sidebar-toggle-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </Button>
        )}

        <Navbar.Brand as={Link} to="/dashboard" className="app-navbar-brand">
          <span className="app-navbar-brand-mark" aria-hidden="true">
            <i className="bi bi-box-fill" />
          </span>
          <span>Codebility</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-label="Toggle navigation" />

        <Navbar.Collapse>
          <div className="app-navbar-actions ms-auto">
            {user?.username && (
              <div className="app-navbar-user" title={user.username}>
                <span className="app-navbar-avatar" aria-hidden="true">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <Navbar.Text className="app-navbar-username">
                  {user.username}
                </Navbar.Text>
              </div>
            )}
            <ThemeSwitcher />

            <Button
              variant="outline-light"
              className="app-navbar-logout"
              size="sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right" aria-hidden="true" />
              <span>Logout</span>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
