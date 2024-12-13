"use client";
import { useUserStore } from "../../zuztand/userStore";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";

export default function AppNavbar() {
  const user = useUserStore((state) => state.user);
  const logoutUser = useUserStore((state) => state.logoutUser);
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Student Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link href="/users">Users</Nav.Link>
                <Nav.Link href="/schools">Schools</Nav.Link>
                <Nav.Link href="/students">Students</Nav.Link>
              </>
            ) : (
              <></>
            )}
          </Nav>
          {user ? (
            <Nav>
              <Dropdown>
                <Dropdown.Toggle
                  style={{ padding: 0 }}
                  variant="dark"
                  id="dropdown-basic"
                >
                  Welcome, <strong>{user.name}</strong>!
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      logoutUser();
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
