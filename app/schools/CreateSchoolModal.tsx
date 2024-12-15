import { useState } from "react";
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
  const [nameError, setNameError] = useState("");
  const [typeError, setTypeError] = useState("");

  const handleSaveSchool = () => {
    let isValid = true;
    schoolName = schoolName.trim();
    if (!schoolName.trim()) {
      setNameError("School name cannot be empty.");
      isValid = false;
    } else {
      setNameError("");
    }
    schoolType = schoolType.trim();
    if (!schoolType.trim()) {
      setTypeError("School type cannot be empty.");
      isValid = false;
    } else {
      setTypeError("");
    }

    if (isValid) {
      createNewSchool();
    }
  };

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
              type="text"
              value={schoolName}
              placeholder="Enter school name"
              onChange={(e) => setSchoolName(e.target.value)}
            />
            {nameError && (
              <div style={{ fontSize: "0.9rem", color: "red" }}>
                {nameError}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="createSchoolType">
            <Form.Label>School type</Form.Label>
            <Form.Control
              type="text"
              value={schoolType}
              placeholder="Enter school type"
              onChange={(e) => setSchoolType(e.target.value)}
            />
            {typeError && (
              <div style={{ fontSize: "0.9rem", color: "red" }}>
                {typeError}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setCreateSchoolModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveSchool}>
          Save School
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
