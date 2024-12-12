// components/CreateSchoolModal.tsx
import { Button, Form, Modal } from "react-bootstrap";

interface CreateSchoolModalProps {
  showCreateSchoolModal: boolean;
  setCreateSchoolModal: (show: boolean) => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
  schoolType: string;
  setSchoolType: (type: string) => void;
  createNewSchool: () => void;
}

export const CreateSchoolModal = ({
  showCreateSchoolModal,
  setCreateSchoolModal,
  schoolName,
  setSchoolName,
  schoolType,
  setSchoolType,
  createNewSchool,
}: CreateSchoolModalProps) => {
  return (
    <Modal
      show={showCreateSchoolModal}
      onHide={() => setCreateSchoolModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create new school</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="createSchoolName">
            <Form.Label>School name</Form.Label>
            <Form.Control
              onChange={(e) => setSchoolName(e.target.value)}
              type="text"
              placeholder="Enter school name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="createSchoolType">
            <Form.Label>School type</Form.Label>
            <Form.Control
              onChange={(e) => setSchoolType(e.target.value)}
              type="text"
              placeholder="Enter school type"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setCreateSchoolModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={createNewSchool}>
          Save School
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
