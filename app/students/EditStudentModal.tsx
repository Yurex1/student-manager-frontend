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
  const [formValues, setFormValues] = useState({
    fullName: student.fullName || "",
    formOfStudy: student.formOfStudy || "",
    locationOfLiving: student.locationOfLiving || "",
    specialCategory: student.specialCategory || "",
    sex: student.sex || "",
    schoolId: student.school.id || "",
    dateOfBirth: student.dateOfBirth || "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormValues({
      fullName: student.fullName,
      formOfStudy: student.formOfStudy,
      locationOfLiving: student.locationOfLiving,
      specialCategory: student.specialCategory,
      sex: student.sex,
      schoolId: student.school.id,
      dateOfBirth: student.dateOfBirth,
    });
  }, [student]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (e: any) => {
    console.log("a");
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    console.log(today, selectedDate);
    if (selectedDate >= today) {
      setErrorMessage("Date of birth cannot be today or in the future.");
    } else {
      setErrorMessage("");
    }
    setFormValues({ ...formValues, dateOfBirth: new Date(e.target.value) });
  };

  const handleSaveChanges = async () => {
    const {
      fullName,
      formOfStudy,
      locationOfLiving,
      specialCategory,
      sex,
      schoolId,
      dateOfBirth,
    } = formValues;

    if (
      !fullName ||
      !formOfStudy ||
      !locationOfLiving ||
      !specialCategory ||
      !sex ||
      !dateOfBirth ||
      !schoolId
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (errorMessage) {
      return;
    }

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
          schoolId,
        },
        { withCredentials: true }
      );
      onStudentUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating student:", error);
      setErrorMessage("Failed to update student. Please try again later.");
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}
        <Form>
          <Form.Group controlId="editStudentFullName" className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formValues.fullName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="editStudentFormOfStudy" className="mb-3">
            <Form.Label>Form of Study</Form.Label>
            <Form.Control
              type="text"
              name="formOfStudy"
              value={formValues.formOfStudy}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="editStudentLocationOfLiving" className="mb-3">
            <Form.Label>Location of Living</Form.Label>
            <Form.Control
              type="text"
              name="locationOfLiving"
              value={formValues.locationOfLiving}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="editStudentSpecialCategory" className="mb-3">
            <Form.Label>Special Category</Form.Label>
            <Form.Control
              type="text"
              name="specialCategory"
              value={formValues.specialCategory}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="editStudentSex" className="mb-3">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              type="text"
              name="sex"
              value={formValues.sex}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="editStudentSchool" className="mb-3">
            <Form.Label>School</Form.Label>
            <Form.Control
              as="select"
              name="schoolId"
              value={formValues.schoolId}
              onChange={handleInputChange}
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
              name="dateOfBirth"
              value={
                formValues.dateOfBirth
                  ? new Date(formValues.dateOfBirth).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleDateChange}
            />
            {errorMessage && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                Date of birth cannot be today or in the future
              </div>
            )}
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
