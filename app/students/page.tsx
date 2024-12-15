"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner } from "react-bootstrap";
import CreateStudentModal from "./CreateStudentModal";
import EditStudentModal from "./EditStudentModal";
import StudentType from "@/types/studentType";
import SchoolType from "@/types/schoolType";
import { useUserStore } from "@/zuztand/userStore";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/config/API_URL";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentType[] | undefined>();
  const [allSchools, setAllSchools] = useState<SchoolType[] | undefined>();
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const getError = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);
  const router = useRouter();

  useEffect(() => {
    const user = useUserStore.getState().user;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!user.schoolId) {
      setError("You don't have a school. Please contact your administrator.");
    } else {
      setError("");
    }

    const fetchData = async () => {
      try {
        const [studentsResponse, schoolsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/students`, { withCredentials: true }),
          axios.get(`${API_URL}/api/schools`, { withCredentials: true }),
        ]);

        setStudents(studentsResponse.data);
        setAllSchools(schoolsResponse.data);
        setError("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (
          error.response?.status === 404 &&
          error.response.data.message === "No students found"
        ) {
          setError("No students found");
          return;
        }
        setError("Failed to load data. Please try again.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          error.response.data.message === "Access token missing"
        ) {
          useUserStore.getState().logoutUser();
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [router, setError]);

  const handleEditClick = (student: StudentType) => {
    setCurrentStudent(student);
    setShowEditStudentModal(true);
  };

  const handleDeleteClick = async (studentId: string) => {
    try {
      await axios.delete(`${API_URL}/api/students/`, {
        params: { ids: [studentId] },
        withCredentials: true,
      });
      alert("Student deleted successfully");
      setStudents((prevStudents) =>
        prevStudents?.filter((student) => student.id !== studentId)
      );
    } catch (error) {
      alert("Error deleting student");
      console.error("Error deleting student:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading...</span>
      </div>
    );
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>All students</h1>

      <Button variant="primary" onClick={() => setShowCreateStudentModal(true)}>
        Create new student
      </Button>

      <div className="mt-3">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Form of Study</th>
              <th>Location of Living</th>
              <th>Special Category</th>
              <th>Sex</th>
              <th>School</th>
              <th>Actions</th>
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
                <td>{student.school?.name}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEditClick(student)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => handleDeleteClick(student.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <strong
          style={{ color: "red", display: "flex", justifyContent: "center" }}
        >
          {getError}
        </strong>
      </div>

      <CreateStudentModal
        show={showCreateStudentModal}
        onClose={() => setShowCreateStudentModal(false)}
        onStudentCreated={() =>
          axios
            .get(`${API_URL}/api/students`, { withCredentials: true })
            .then((response) => setStudents(response.data))
        }
        allSchools={allSchools}
      />

      {currentStudent && (
        <EditStudentModal
          show={showEditStudentModal}
          onClose={() => setShowEditStudentModal(false)}
          student={currentStudent}
          onStudentUpdated={() =>
            axios
              .get(`${API_URL}/api/students`, { withCredentials: true })
              .then((response) => setStudents(response.data))
          }
          allSchools={allSchools}
        />
      )}
    </main>
  );
}
