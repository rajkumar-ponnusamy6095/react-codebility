import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import "../AppNavbar/AppNavbar.css";

export default function PlainNavBar() {
  return (
    <Navbar className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/login">
          Codebility
        </Navbar.Brand>
        <ThemeSwitcher />
      </Container>
    </Navbar>
  );
}
