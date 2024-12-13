import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import StudentType from "@/types/studentType";
import SchoolType from "@/types/schoolType";
import { API_URL } from "@/app/config/API_URL";
interface EditStudentModalProps {
  show: boolean;
  onClose: () => void;
  student: StudentType;
  onStudentUpdated: () => void;
  allSchools: SchoolType[] | undefined;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  show,
  onClose,
  student,
  onStudentUpdated,
  allSchools,
}) => {
  const [fullName, setFullName] = useState(student.fullName);
  const [formOfStudy, setFormOfStudy] = useState(student.formOfStudy);
  const [locationOfLiving, setLocationOfLiving] = useState(
    student.locationOfLiving
  );
  const [specialCategory, setSpecialCategory] = useState(
    student.specialCategory
  );
  const [sex, setSex] = useState(student.sex);
  const [school, setSchool] = useState(student.school.id);
  const [dateOfBirth, setDateOfBirth] = useState(student.dateOfBirth);

  useEffect(() => {
    setFullName(student.fullName);
    setFormOfStudy(student.formOfStudy);
    setLocationOfLiving(student.locationOfLiving);
    setSpecialCategory(student.specialCategory);
    setSex(student.sex);
    setSchool(student.school.id);
    setDateOfBirth(student.dateOfBirth);
  }, [student]);

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `${API_URL}/api/students/${student.id}`,
        {
          fullName,
          formOfStudy,
          locationOfLiving,
          specialCategory,
          sex,
          dateOfBirth,
          schoolId: school,
        },
        { withCredentials: true }
      );
      onStudentUpdated();
      onClose();
    } catch (error) {
      console.log("Error updating student:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="editStudentFullName" className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="editStudentFormOfStudy" className="mb-3">
            <Form.Label>Form of Study</Form.Label>
            <Form.Control
              type="text"
              value={formOfStudy}
              onChange={(e) => setFormOfStudy(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="editStudentLocationOfLiving" className="mb-3">
            <Form.Label>Location of Living</Form.Label>
            <Form.Control
              type="text"
              value={locationOfLiving}
              onChange={(e) => setLocationOfLiving(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="editStudentSpecialCategory" className="mb-3">
            <Form.Label>Special Category</Form.Label>
            <Form.Control
              type="text"
              value={specialCategory}
              onChange={(e) => setSpecialCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="editStudentSex" className="mb-3">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              type="text"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="editStudentSchool" className="mb-3">
            <Form.Label>School</Form.Label>
            <Form.Control
              as="select"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            >
              <option value="">Select a school</option>
              {allSchools?.map((schoolItem) => (
                <option key={schoolItem.id} value={schoolItem.id}>
                  {schoolItem.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editStudentDateOfBirth" className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={
                dateOfBirth
                  ? new Date(dateOfBirth).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => setDateOfBirth(new Date(e.target.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditStudentModal;
