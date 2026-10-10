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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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
        expand="md"
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
                <div className="app-profile-menu">
                  <button type="button" className="app-navbar-user" aria-label="Open profile menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)} title={user.name}>
                  <span className="app-navbar-avatar" aria-hidden="true">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="app-navbar-name">{user.name}</span>
                  <i className="bi bi-chevron-down app-profile-chevron" aria-hidden="true" />
                  </button>
                  {profileMenuOpen && <div className="app-profile-dropdown" aria-label="Profile menu">
                    <div className="app-profile-summary"><span className="app-profile-dropdown-avatar">{user.name.charAt(0).toUpperCase()}</span><span className="app-profile-summary-copy"><strong>{user.name}</strong>{user.email && <small>{user.email}</small>}</span></div>
                    <Link to="/profile" className="app-profile-link" onClick={() => setProfileMenuOpen(false)}><i className="bi bi-person-circle" aria-hidden="true" /><span>Profile &amp; security</span><i className="bi bi-arrow-up-right ms-auto" aria-hidden="true" /></Link>
                  </div>}
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
