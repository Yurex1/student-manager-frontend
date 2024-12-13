"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/zuztand/userStore";
import { useRouter } from "next/navigation";
import { Button, Table, Form, Modal, Spinner } from "react-bootstrap";
import { CreateSchoolModal } from "./CreateSchoolModal";
import { StudentsModal } from "./StudentsModal";
import SchoolType from "@/types/schoolType";
import StudentType from "@/types/studentType";
import { API_URL } from "@/app/config/API_URL";
export default function Home() {
  const [allSchools, setAllSchools] = useState<SchoolType[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showCreateSchoolModal, setCreateSchoolModal] = useState(false);
  const [students, setStudents] = useState<StudentType[] | undefined>(
    undefined
  );
  const [schoolName, setSchoolName] = useState<string>("");
  const [schoolType, setSchoolType] = useState<string>("");
  const [currentSchool, setCurrentSchool] = useState<string | null>(null);
  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
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

  useEffect(() => {
    const user = useUserStore.getState().user;
    if (!user) {
      router.push("/login");
      return;
    }
    console.log("user", user.schoolId);
    if (!user.schoolId) {
      setError("You don't have a school. Please contact your administrator.");
    } else {
      setError("");
    }
    const fetchSchools = async () => {
      const schools = await getAllSchools();
      setAllSchools(schools);
    };

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
      const response = await axios.get(`${API_URL}/api/schools`, {
        withCredentials: true,
      });
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.log("Error fetching schools:", error);
      return undefined;
    }
  };

  const createNewSchool = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/schools`,
        {
          name: schoolName,
          type: schoolType,
        },
        { withCredentials: true }
      );
      alert("School created successfully");
      setCreateSchoolModal(false);
      const schools = await getAllSchools();
      setAllSchools(schools);
    } catch (error) {
      console.log("Error creating school:", error);
    }
  };

  const handleShowStudents = async (schoolId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/schools/getAllStudents/${schoolId}`,
        { withCredentials: true }
      );
      const currentSchool = allSchools?.find(
        (school) => school.id === schoolId
      );
      setStudents(response.data);
      setCurrentSchool(currentSchool?.name || null);
      setShowStudentsModal(true);
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  if (error) {
    return (
      <strong
        style={{ color: "red", display: "flex", justifyContent: "center" }}
      >
        {error}
      </strong>
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
      {user?.isAdmin && (
        <Button
          variant="primary"
          onClick={() => {
            setCreateSchoolModal(true);
          }}
        >
          Create new school
        </Button>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2>Schools</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allSchools?.map((school) => (
              <tr key={school.id}>
                <td>{school.name}</td>
                <td>{school.type}</td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => handleShowStudents(school.id)}
                  >
                    View Students
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <CreateSchoolModal
        showCreateSchoolModal={showCreateSchoolModal}
        setCreateSchoolModal={setCreateSchoolModal}
        schoolName={schoolName}
        setSchoolName={setSchoolName}
        schoolType={schoolType}
        setSchoolType={setSchoolType}
        createNewSchool={createNewSchool}
      />

      <StudentsModal
        showStudentsModal={showStudentsModal}
        setShowStudentsModal={setShowStudentsModal}
        students={students}
        currentSchool={currentSchool}
      />
    </main>
  );
}
