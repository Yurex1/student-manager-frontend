"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import UserType from "@/types/userType";
import { useUserStore } from "@/zuztand/userStore";
import { useRouter } from "next/navigation";

const UsersPage = () => {
  const currentUser = useUserStore.getState().user;
  const [users, setUsers] = useState<UserType[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    fetchSchools();
    setIsAdmin(currentUser?.isAdmin || false);
  }, []);

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      console.log("Error response:", error.response.data.message);
      if (
        error.response?.status === 401 &&
        error.response.data.message === "Access token missing"
      ) {
        useUserStore.getState().logoutUser();
        router.push("/login");
        return;
      }
      return Promise.reject(error);
    }
  );

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8030/api/users", {
        withCredentials: true,
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axios.get("http://localhost:8030/api/schools", {
        withCredentials: true,
      });
      setSchools(response.data);
    } catch (error) {
      console.log("Error fetching schools:", error);
    }
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      await axios.put(
        `http://localhost:8030/api/users/${editingUser.id}`,
        {
          isAdmin: editingUser.isAdmin,
          schoolId: editingUser.school?.id,
        },
        { withCredentials: true }
      );
      alert("User updated successfully!");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.id === id) {
      alert("You cannot delete yourself!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete("http://localhost:8030/api/users", {
        data: { ids: [id] },
        withCredentials: true,
      });
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <h1>Users</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Login</th>
            <th>Admin</th>
            <th>School</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: UserType) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.login}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td>{user.school?.name || "null"}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEdit(user)}
                  disabled={!isAdmin}
                >
                  Edit
                </Button>{" "}
                {currentUser?.id !== user.id && (
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUser && (
            <Form>
              <Form.Group controlId="formIsAdmin">
                <Form.Label>Is Admin</Form.Label>
                <Form.Check
                  type="checkbox"
                  checked={editingUser.isAdmin}
                  onChange={(e) => {
                    setEditingUser({
                      ...editingUser,
                      isAdmin: e.target.checked,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formSchool">
                <Form.Label>School</Form.Label>
                <Form.Control
                  as="select"
                  value={editingUser.school?.id || ""}
                  onChange={(e) => {
                    setEditingUser({
                      ...editingUser,
                      school: schools.find(
                        (school) => school.id === e.target.value
                      ),
                    });
                  }}
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersPage;
