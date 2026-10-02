import { Navbar, Container, Button, Alert } from "react-bootstrap";

import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
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
  const [logoutError, setLogoutError] = useState("");

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setLogoutError("");

    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Logout failed",
      );
    }
  };

  return (
    <>
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
              {user?.name && (
                <Link
                  to="/profile"
                  className="app-navbar-user"
                  aria-label="View your profile"
                  title={user.name}
                >
                  <span className="app-navbar-avatar" aria-hidden="true">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="app-navbar-name">{user.name}</span>
                </Link>
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
      {logoutError && (
        <Alert
          variant="danger"
          className="mb-0"
          role="alert"
          dismissible
          onClose={() => setLogoutError("")}
        >
          {logoutError}
        </Alert>
      )}
    </>
  );
}
