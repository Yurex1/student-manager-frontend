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
import UserType from "@/types/userType";

export default function StudentsPage() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [allSchools, setAllSchools] = useState<SchoolType[] | undefined>();
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setError("");
    const user = useUserStore.getState().user;
    setCurrentUser(user);
    if (!user) {
      router.push("/login");
      return;
    }

    if (!user.schoolId && !user.isAdmin) {
      setError("You don't have a school. Please contact your administrator.");
    } else {
      setError("");
    }

    // Fetch schools and students data directly inside useEffect
    axios
      .get(`${API_URL}/api/schools`, { withCredentials: true })
      .then((schoolsResponse) => {
        setAllSchools(schoolsResponse.data);
        return axios.get(`${API_URL}/api/students`, { withCredentials: true });
      })
      .then((studentsResponse) => {
        setStudents(studentsResponse.data);

        if (studentsResponse.data.length === 0) {
          if (user.isAdmin) {
            setError("No students exist.");
          } else {
            setError("There are no students for your school.");
          }
        } else {
          setError(""); // Clear the error when students are found
        }
      })

      .catch((error) => {
        console.log("Error fetching students:", error);
        if (
          error.response.status === 404 &&
          error.response.data.message === "No schools found"
        ) {
          setError("There are no schools.");
          return;
        }

        if (
          error.response.status === 404 &&
          error.response.data.message === "No students found" &&
          user?.isAdmin
        ) {
          setError("There are no students at all.");
        } else if (
          error.response.status === 404 &&
          error.response.data.message.includes("No students found") &&
          !user?.isAdmin
        ) {
          setError("There are no students for your school.");
        } else {
          setError("Failed to load data. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleEditClick = (student: StudentType) => {
    setCurrentStudent(student);
    setShowEditStudentModal(true);
  };

  const handleDeleteClick = async (studentId: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/students/`, {
        params: { ids: [studentId] },
        withCredentials: true,
      });
      alert("Student deleted successfully");
      setStudents((prevStudents) =>
        prevStudents?.filter((student) => student.id !== studentId)
      );
      if (students?.length === 1) {
        setError(
          currentUser?.isAdmin
            ? "No students exist."
            : "There are no students for your school."
        );
      }
    } catch (error) {
      alert("Error deleting student");
      console.log("Error deleting student:", error);
    }
  };

  if (!currentUser?.isAdmin && !currentUser?.schoolId) {
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
        <strong
          style={{ color: "red", display: "flex", justifyContent: "center" }}
        >
          You don&apos;t have a school. Please contact your administrator
        </strong>
      </main>
    );
  }

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
        {error && (
          <div>
            <strong
              style={{
                color: "red",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {error}
            </strong>
          </div>
        )}
        {!error && (
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
        )}
      </div>

      <CreateStudentModal
        show={showCreateStudentModal}
        onClose={() => setShowCreateStudentModal(false)}
        onStudentCreated={(newStudent) => {
          setStudents((prevStudents) => [...prevStudents, newStudent]);
          setError(undefined); // Clear any error message
        }}
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
