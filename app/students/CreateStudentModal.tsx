import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SchoolType from "@/types/schoolType";
import { API_URL } from "../config/API_URL";
import StudentType from "@/types/studentType";

interface CreateStudentModalProps {
  show: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStudentCreated: (newStudent: StudentType) => void;
  allSchools: SchoolType[] | undefined;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  show,
  onClose,
  onStudentCreated,
  allSchools,
}) => {
  const [studentFullName, setStudentFullName] = useState("");
  const [studentFormOfStudy, setStudentFormOfStudy] = useState("");
  const [studentLocationOfLiving, setStudentLocationOfLiving] = useState("");
  const [studentSpecialCategory, setStudentSpecialCategory] = useState("");
  const [studentSex, setStudentSex] = useState("");
  const [studentSchool, setStudentSchool] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (
      !studentFullName ||
      !studentFormOfStudy ||
      !studentLocationOfLiving ||
      !studentSpecialCategory ||
      !studentSex ||
      !dateOfBirth ||
      !studentSchool
    ) {
      return;
    }
    if (dateOfBirth > new Date()) {
      setErrorMessage("Date of birth cannot be in the future.");
      return;
    }
    try {
      const result = await axios.post(
        `${API_URL}/api/students`,
        {
          fullName: studentFullName,
          formOfStudy: studentFormOfStudy,
          locationOfLiving: studentLocationOfLiving,
          specialCategory: studentSpecialCategory,
          sex: studentSex,
          dateOfBirth: dateOfBirth,
          schoolId: studentSchool,
        },
        { withCredentials: true }
      );
      alert("Student created successfully");
      const student: StudentType = result.data;
      onStudentCreated(student);
      onClose();
    } catch (error) {
      alert("Error creating student");
      console.log("Error creating student:", error);
    }
  };

  const getErrorText = (value: string | Date | null) => {
    return isSubmitted && !value ? "Field cannot be empty" : "";
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create new student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="createStudentFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={studentFullName}
              onChange={(e) => setStudentFullName(e.target.value)}
            />
            {getErrorText(studentFullName) && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                {getErrorText(studentFullName)}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="createStudentFormOfStudy">
            <Form.Label>Form of Study</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter form of study"
              value={studentFormOfStudy}
              onChange={(e) => setStudentFormOfStudy(e.target.value)}
            />
            {getErrorText(studentFormOfStudy) && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                {getErrorText(studentFormOfStudy)}
              </div>
            )}
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="createStudentLocationOfLiving"
          >
            <Form.Label>Location of Living</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location of living"
              value={studentLocationOfLiving}
              onChange={(e) => setStudentLocationOfLiving(e.target.value)}
            />
            {getErrorText(studentLocationOfLiving) && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                {getErrorText(studentLocationOfLiving)}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="createStudentSpecialCategory">
            <Form.Label>Special Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter special category"
              value={studentSpecialCategory}
              onChange={(e) => setStudentSpecialCategory(e.target.value)}
            />
            {getErrorText(studentSpecialCategory) && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                {getErrorText(studentSpecialCategory)}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="createStudentDateOfBirth">
            <Form.Label>Date of birth</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter date of birth"
              value={dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : ""}
              onChange={(e) => {
                setDateOfBirth(new Date(e.target.value));
              }}
            />
            {(errorMessage && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                Date of birth cannot be today or in the future
              </div>
            )) ||
              (getErrorText(dateOfBirth) && (
                <div style={{ color: "red", fontSize: "0.9rem" }}>
                  {getErrorText(dateOfBirth)}
                </div>
              ))}
          </Form.Group>

          <Form.Group className="mb-3" controlId="createStudentSex">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter sex"
              value={studentSex}
              onChange={(e) => setStudentSex(e.target.value)}
            />
            {getErrorText(studentSex) && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                {getErrorText(studentSex)}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="createStudentSchool">
            <Form.Label>School</Form.Label>
            <Form.Control
              as="select"
              value={studentSchool}
              onChange={(e) => setStudentSchool(e.target.value)}
            >
              <option value="">Select a school</option>
              {allSchools?.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </Form.Control>
            {getErrorText(studentSchool) && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>
                {getErrorText(studentSchool)}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={createNewStudent}>
          Save Student
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateStudentModal;
