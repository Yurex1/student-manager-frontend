"use client";
import { useUserStore } from "../../zuztand/userStore";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

export default function AppNavbar() {
  const user = useUserStore((state) => state.user);
  const f = () => {
    console.log(useUserStore.getState().user);
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/schools">Schools</Nav.Link>
          </Nav>
          <Button onClick={() => f()}>get</Button>
          {user ? (
            <Nav>
              <Nav.Link disabled>
                Welcome, <strong>{user.name}</strong>!
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
