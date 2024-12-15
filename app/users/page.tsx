"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner } from "react-bootstrap";
import UserType from "@/types/userType";
import { useUserStore } from "@/zuztand/userStore";
import { useRouter } from "next/navigation";
import EditUserModal from "./EditUserModal";
import EditUserModalNotAdmin from "./EditUserModalNotAdmin";
import { API_URL } from "@/app/config/API_URL";
import SchoolType from "@/types/schoolType";
const UsersPage = () => {
  const currentUser = useUserStore.getState().user;
  console.log("current user", currentUser);
  const [users, setUsers] = useState<UserType[]>([]);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType>();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const setError = useUserStore((state) => state.setError);

  useEffect(() => {
    setError("");
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
      const response = await axios.get(`${API_URL}/api/users`, {
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
      const response = await axios.get(`${API_URL}/api/schools`, {
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

  const handleSave = async (updatePassword?: string) => {
    if (!editingUser) return;

    const isCurrentUser = editingUser.id === currentUser?.id;
    const endpoint = isCurrentUser
      ? `${API_URL}/api/users/updateMe`
      : `${API_URL}/api/users/updateUser/${editingUser.id}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = isCurrentUser
      ? {
          login: editingUser.login,
          name: editingUser.name,
        }
      : {
          isAdmin: editingUser.isAdmin,
          schoolId: editingUser.school?.id,
        };

    if (updatePassword) {
      console.log("updatePassword", updatePassword);
      payload.password = updatePassword;
    } else {
      console.log("no updatePassword");
    }
    try {
      await axios.put(endpoint, payload, { withCredentials: true });
      alert("User updated successfully!");
      setShowModal(false);
      fetchUsers();
      if (isCurrentUser) {
        editingUser.password = "";
        useUserStore.setState({ user: editingUser });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert("Error updating user");
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.id === id) {
      alert("You cannot delete yourself!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_URL}/api/users`, {
        data: { ids: [id] },
        withCredentials: true,
      });
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      alert("Error deleting user");
      console.log("Error deleting user:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>All users</h1>
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
          {[
            currentUser!,
            ...users.filter((user) => user.id !== currentUser?.id),
          ].map((user: UserType) => {
            console.log(user);
            return (
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
                      className="ms-2"
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {currentUser?.isAdmin ? (
        <EditUserModal
          currentUser={currentUser}
          showModal={showModal}
          handleModalClose={handleModalClose}
          editingUser={editingUser!}
          setEditingUser={setEditingUser}
          schools={schools}
          handleSave={handleSave}
        />
      ) : (
        <EditUserModalNotAdmin
          showModal={showModal}
          handleModalClose={handleModalClose}
          editingUser={editingUser!}
          setEditingUser={setEditingUser}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default UsersPage;
