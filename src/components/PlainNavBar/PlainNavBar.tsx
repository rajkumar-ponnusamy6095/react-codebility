import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import "../AppNavbar/AppNavbar.css";

export default function PlainNavBar() {
  return (
    <Navbar expand="lg" className="app-navbar">
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/login"
          className="app-navbar-brand"
        >
          <span className="app-navbar-brand-mark" aria-hidden="true">
            <i className="bi bi-box-fill" />
          </span>
          Codebility
        </Navbar.Brand>
        <div className="ms-auto">
          <ThemeSwitcher />
        </div>
      </Container>
    </Navbar>
  );
}
