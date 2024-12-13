import { Button, Table, Modal } from "react-bootstrap";
import StudentType from "@/types/studentType";

interface StudentsModalProps {
  showStudentsModal: boolean;
  setShowStudentsModal: (show: boolean) => void;
  students: StudentType[] | undefined;
  currentSchool: string | null;
}

export const StudentsModal = ({
  showStudentsModal,
  setShowStudentsModal,
  students,
  currentSchool,
}: StudentsModalProps) => {
  return (
    <Modal
      size="lg"
      show={showStudentsModal}
      onHide={() => setShowStudentsModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Students in School ({currentSchool})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {students?.length ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full name</th>
                <th>Form of study</th>
                <th>Location of living</th>
                <th>Special category</th>
                <th>Sex</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: StudentType) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.fullName}</td>
                  <td>{student.formOfStudy}</td>
                  <td>{student.locationOfLiving}</td>
                  <td>{student.specialCategory}</td>
                  <td>{student.sex}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No students found for this school.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowStudentsModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
