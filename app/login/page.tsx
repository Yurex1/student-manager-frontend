"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../../zuztand/userStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { API_URL } from "@/app/config/API_URL";
const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    setError("");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/auth/login`,
        {
          login,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const userResponse = await axios.get(`${API_URL}/api/users/me`, {
        withCredentials: true,
      });

      setUser(userResponse.data);

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response.data.message);
      console.log(err);
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
