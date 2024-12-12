"use client";

import { useState } from "react";
import { useUserStore } from "../../zuztand/userStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);
  const error = useUserStore((state) => state.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:8030/api/auth/login",
        {
          login,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data.accessToken);
      const userResponse = await axios.get(
        "http://localhost:8030/api/users/me",
        {
          withCredentials: true,
        }
      );

      setUser(userResponse.data);

      router.push("/getMe");
      //   eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-center">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="login">
            <Form.Label>Login:</Form.Label>
            <Form.Control
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Enter login"
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-3"
            disabled={!login || !password}
          >
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
