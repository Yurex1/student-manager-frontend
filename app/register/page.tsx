"use client";

import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8030/api/auth/register", {
        login,
        password,
        name: fullName,
      });
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLocalError(
        "Error occurred: " + error.response.data.message.toString()
      );
      console.log("A", error.response.data.message.toString());
    }
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1>Register</h1>
      <Form
        onSubmit={registerUser}
        style={{
          width: "300px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form.Group>
          <Form.Label>Login</Form.Label>
          <Form.Control
            onChange={(e) => setLogin(e.target.value)}
            type="text"
            placeholder="Enter login"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter full name</Form.Label>
          <Form.Control
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Enter full name"
            required
          />
          <Button
            type="submit"
            style={{ marginTop: "10px" }}
            disabled={!login || !password || !fullName}
          >
            Submit
          </Button>
        </Form.Group>
      </Form>

      {localError && (
        <div
          style={{
            color: "#d9534f",
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f8d7da",
            borderRadius: "5px",
            border: "1px solid #f5c6cb",
            fontSize: "14px",
            lineHeight: "1.5",
            width: "300px",
          }}
        >
          {localError}
        </div>
      )}
    </main>
  );
}
