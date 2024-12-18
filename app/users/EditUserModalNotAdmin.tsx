import UserType from "@/types/userType";
import { useUserStore } from "@/zuztand/userStore";
import { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

interface EditUserModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  editingUser: UserType;
  setEditingUser: (user: UserType) => void;
  handleSave: (updatePassword?: string) => Promise<void>;
}

const EditUserModalNotAdmin: React.FC<EditUserModalProps> = ({
  showModal,
  handleModalClose,
  editingUser,
  setEditingUser,
  handleSave,
}) => {
  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);
  const [repeatedPassword, setUpdatedPassword] = useState("");
  const handleInputChange = (field: string, value: string) => {
    setEditingUser({ ...editingUser, [field]: value });
    setError("");
  };

  const handleSaveClick = async () => {
    if (repeatedPassword && repeatedPassword !== editingUser.password) {
      setError("Passwords don't match");
      return;
    }
    try {
      if (repeatedPassword) {
        await handleSave(repeatedPassword);
      } else {
        await handleSave();
      }
      setError("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editingUser && (
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingUser.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group controlId="formLogin" className="mt-3">
              <Form.Label>Login</Form.Label>
              <Form.Control
                type="text"
                value={editingUser.login || ""}
                onChange={(e) => handleInputChange("login", e.target.value)}
                placeholder="Enter your login"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter a new password"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Repeat your password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setUpdatedPassword(e.target.value)}
                placeholder="Enter a new password"
              />
            </Form.Group>
          </Form>
        )}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModalNotAdmin;
