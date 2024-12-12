"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import StudentType from "@/types/studentType";
export default function StudentsPage() {
  const [students, setStudents] = useState<StudentType[] | undefined>(
    undefined
  );
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [studentFullName, setStudentFullName] = useState("");
  const [studentFormOfStudy, setStudentFormOfStudy] = useState("");
  const [studentLocationOfLiving, setStudentLocationOfLiving] = useState("");
  const [studentSpecialCategory, setStudentSpecialCategory] = useState("");
  const [studentSex, setStudentSex] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await getAllStudents();
      setStudents(students);
    };

    fetchStudents();
  }, []);

  const getAllStudents = async (): Promise<StudentType[] | undefined> => {
    try {
      const response = await axios.get("http://localhost:8030/api/students", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching students:", error);
      return undefined;
    }
  };

  const createNewStudent = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8030/api/students",
        {
          fullName: studentFullName,
          formOfStudy: studentFormOfStudy,
          locationOfLiving: studentLocationOfLiving,
          specialCategory: studentSpecialCategory,
          sex: studentSex,
        },
        { withCredentials: true }
      );
      console.log("New student created:", response.data);
      setShowCreateStudentModal(false);
      // After creation, re-fetch the students to update the list
      const students = await getAllStudents();
      setStudents(students);
    } catch (error) {
      console.log("Error creating student:", error);
    }
  };

  return (
    <main>
      <h1>All Students</h1>

      {/* Button to open modal for creating a new student */}
      <Button variant="primary" onClick={() => setShowCreateStudentModal(true)}>
        Create new student
      </Button>

      <div className="mt-3">
        {/* Students List */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Form of Study</th>
              <th>Location of Living</th>
              <th>Special Category</th>
              <th>Sex</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student) => (
              <tr key={student.id}>
                <td>{student.fullName}</td>
                <td>{student.formOfStudy}</td>
                <td>{student.locationOfLiving}</td>
                <td>{student.specialCategory}</td>
                <td>{student.sex}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Create Student */}
      <Modal
        show={showCreateStudentModal}
        onHide={() => setShowCreateStudentModal(false)}
      >
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
                onChange={(e) => setStudentFullName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="createStudentFormOfStudy">
              <Form.Label>Form of Study</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter form of study"
                onChange={(e) => setStudentFormOfStudy(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="createStudentLocationOfLiving"
            >
              <Form.Label>Location of Living</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location of living"
                onChange={(e) => setStudentLocationOfLiving(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="createStudentSpecialCategory"
            >
              <Form.Label>Special Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter special category"
                onChange={(e) => setStudentSpecialCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="createStudentSex">
              <Form.Label>Sex</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter sex"
                onChange={(e) => setStudentSex(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCreateStudentModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={createNewStudent}>
            Save Student
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
