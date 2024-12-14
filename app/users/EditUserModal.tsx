import SchoolType from "@/types/schoolType";
import UserType from "@/types/userType";
import { Modal, Form, Button } from "react-bootstrap";

interface EditUserModalProps {
  currentUser: UserType;
  showModal: boolean;
  handleModalClose: () => void;
  editingUser: UserType;
  setEditingUser: (user: UserType) => void;
  schools: SchoolType[];
  handleSave: () => void;
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
  );
};

export default EditUserModal;
