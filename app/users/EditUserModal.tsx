import { Modal, Form, Button } from "react-bootstrap";

interface EditUserModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  editingUser: any;
  setEditingUser: (user: any) => void;
  schools: any[];
  handleSave: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
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
  );
};

export default EditUserModal;
