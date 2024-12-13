"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import UserType from "@/types/userType";
import { useUserStore } from "@/zuztand/userStore";
import { useRouter } from "next/navigation";
import EditUserModal from "./EditUserModal";
import EditUserModalNotAdmin from "./EditUserModalNotAdmin";
const UsersPage = () => {
  const currentUser = useUserStore.getState().user;
  const [users, setUsers] = useState<UserType[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    fetchUsers();
    fetchSchools();
    setIsAdmin(currentUser?.isAdmin || false);
  }, []);

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
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

  const handleSaveMe = async () => {
    if (!editingUser) return;
    console.log("HERE");
    try {
      await axios.put(
        `http://localhost:8030/api/users/updateMe`,
        {
          login: editingUser.login,
          name: editingUser.name,
          password: editingUser.password,
        },
        { withCredentials: true }
      );
      alert("User updated successfully!");
      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      setError(error.response.data.message);
      throw new Error(error.response.data.message);
      console.error("Error updating user:", error);
    }
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      await axios.put(
        `http://localhost:8030/api/users/updateUser/${editingUser.id}`,
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
              <td>{user.school?.name || "No school"}</td>
              <td>
                {currentUser?.id === user.id ? (
                  <Button variant="primary" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(user)}
                    disabled={!isAdmin}
                  >
                    Edit
                  </Button>
                )}
                {currentUser?.isAdmin && currentUser?.id !== user.id && (
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
      {currentUser?.isAdmin ? (
        <EditUserModal
          showModal={showModal}
          handleModalClose={handleModalClose}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          schools={schools}
          handleSave={handleSave}
        />
      ) : (
        <EditUserModalNotAdmin
          showModal={showModal}
          handleModalClose={handleModalClose}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          handleSave={handleSaveMe}
        />
      )}
    </div>
  );
};

export default UsersPage;
