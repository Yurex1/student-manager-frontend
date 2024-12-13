"use client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import CreateStudentModal from "./CreateStudentModal";
import StudentType from "@/types/studentType";
import EditStudentModal from "./EditStudentModal";
import SchoolType from "@/types/schoolType";
import { useUserStore } from "@/zuztand/userStore";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentType[] | undefined>(
    undefined
  );
  const [allSchools, setAllSchools] = useState<SchoolType[] | undefined>(
    undefined
  );
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentType | null>(
    null
  );
  const getError = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const user = useUserStore.getState().user;

    if (!user) {
      router.push("/login");
      return;
    }
    console.log("user", user);
    if (!user.schoolId) {
      setError("You don't have a school. Please contact your administrator.");
    } else {
      console.log("ASDASD");
      setError("");
    }
    const fetchStudents = async () => {
      const students = await getAllStudents();
      setStudents(students);
    };
    const fetchSchools = async () => {
      const schools = await getAllSchools();
      setAllSchools(schools);
    };

    fetchStudents();
    fetchSchools();
  }, []);

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (
        error.response?.status === 401 &&
        error.response.data.message === "Access token missing"
      ) {
        useUserStore.getState().logoutUser();
        router.push("/login");
        return;
      }
      return Promise.reject(error);
    }
  );

  const getAllSchools = async (): Promise<SchoolType[] | undefined> => {
    try {
      const response = await axios.get("http://localhost:8030/api/schools", {
        withCredentials: true,
      });
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.log("Error fetching schools:", error);
      return undefined;
    }
  };

  const getAllStudents = async (): Promise<StudentType[] | undefined> => {
    try {
      const response = await axios.get("http://localhost:8030/api/students", {
        withCredentials: true,
      });
      setIsLoading(false);
      setError("");
      return response.data;
    } catch (error) {
      setError("There's no students in your school.");
      console.log("Error fetching students:", error);
      return undefined;
    }
  };

  const handleStudentCreated = () => {
    getAllStudents().then((students) => setStudents(students));
  };

  const handleEditClick = (student: StudentType) => {
    setCurrentStudent(student);
    setShowEditStudentModal(true);
  };

  const handleDeleteClick = async (studentId: string) => {
    try {
      await axios.delete(`http://localhost:8030/api/students/`, {
        params: { ids: [studentId] },
        withCredentials: true,
      });
      setStudents((prevStudents) =>
        prevStudents?.filter((student) => student.id !== studentId)
      );
    } catch (error) {
      console.log("Error deleting student:", error);
    }
  };

  if (isLoading) {
    return <div>Loading students...</div>;
  }

  return (
    <main>
      <h1>All Students</h1>

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
        onStudentCreated={handleStudentCreated}
        allSchools={allSchools}
      />

      {currentStudent && (
        <EditStudentModal
          show={showEditStudentModal}
          onClose={() => setShowEditStudentModal(false)}
          student={currentStudent}
          onStudentUpdated={() =>
            getAllStudents().then((students) => setStudents(students))
          }
          allSchools={allSchools}
        />
      )}
    </main>
  );
}
