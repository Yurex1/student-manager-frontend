import SchoolType from "@/types/schoolType";
import UserType from "@/types/userType";
import { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

interface EditUserModalProps {
  currentUser: UserType;
  showModal: boolean;
  handleModalClose: () => void;
  editingUser: UserType;
  setEditingUser: (user: UserType) => void;
  schools: SchoolType[];
  handleSave: (changePassword?: string) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  currentUser,
  showModal,
  handleModalClose,
  editingUser,
  setEditingUser,
  schools,
  handleSave,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [error, setError] = useState("");

  const handleSaveChanges = () => {
    if (editingUser.id === currentUser.id) {
      if (newPassword !== repeatedPassword) {
        setError("Passwords do not match!");
        return;
      }
      if (!newPassword) {
        handleSave();
        return;
      }

      handleSave(newPassword);
      return;
    }
    handleSave();
  };

  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editingUser && (
          <Form>
            {editingUser.id !== currentUser.id && (
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
            )}

            <Form.Group controlId="formSchool">
              <Form.Label>School</Form.Label>
              <Form.Control
                as="select"
                value={editingUser.school?.id || ""}
                onChange={(e) => {
                  setEditingUser({
                    ...editingUser,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
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
            {currentUser.id === editingUser.id && (
              <>
                <Form.Group controlId="formNewPassword" className="mt-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                  />
                </Form.Group>
                <Form.Group controlId="formRepeatPassword" className="mt-3">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={repeatedPassword}
                    onChange={(e) => setRepeatedPassword(e.target.value)}
                    placeholder="Repeat the new password"
                  />
                </Form.Group>
              </>
            )}
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
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
