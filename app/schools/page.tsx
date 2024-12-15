"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/zuztand/userStore";
import { useRouter } from "next/navigation";
import { Button, Table, Spinner } from "react-bootstrap";
import { StudentsModal } from "./StudentsModal";
import SchoolType from "@/types/schoolType";
import StudentType from "@/types/studentType";
import { API_URL } from "@/app/config/API_URL";
import dynamic from "next/dynamic";
import { CreateSchoolModal } from "./CreateSchoolModal";

export default function Home() {
  const [allSchools, setAllSchools] = useState<SchoolType[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showCreateSchoolModal, setShowCreateSchoolModal] = useState(false);
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

  useEffect(() => {
    const initialize = async () => {
      try {
        setError("");
        const user = useUserStore.getState().user;
        if (!user) {
          router.push("/login");
          return;
        }

        if (!user.isAdmin && !user.schoolId) {
          setError(
            "You don't have a school. Please contact your administrator."
          );
          return;
        }

        const schools = await fetchSchools();
        setAllSchools(schools);
      } catch (err) {
        console.log("Initialization error:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [router]);

  const fetchSchools = async (): Promise<SchoolType[] | undefined> => {
    try {
      const response = await axios.get(`${API_URL}/api/schools`, {
        withCredentials: true,
      });

      return response.data;
    } catch (err: any) {
      console.log(err.response.data);
      if (err.response.data.message === "No schools found") {
        setError("There are no schools.");
        return undefined;
      }
      console.log("Error fetching schools:", err);
      setError("Unable to fetch schools. Please try again later.");
      return undefined;
    }
  };

  const createNewSchool = async () => {
    try {
      await axios.post(
        `${API_URL}/api/schools`,
        { name: schoolName, type: schoolType },
        { withCredentials: true }
      );

      alert("School created successfully");
      setShowCreateSchoolModal(false);

      const schools = await fetchSchools();
      setAllSchools(schools);
      console.log("Schools:", schools);
      if (!schools?.length) {
        setError("There are no schools.");
      }
    } catch (error: any) {
      console.log("Error creating school:", error);
      const message =
        error.response?.status === 400 &&
        error.response.data.message === "School with this name already exists"
          ? "School with this name already exists"
          : "Error creating school. Please try again.";
      alert(message);
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
      setError("Unable to fetch students. Please try again later.");
    }
  };

  const deleteSchool = async (schoolId: string) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;

    try {
      await axios.delete(`${API_URL}/api/schools`, {
        params: { ids: [schoolId] },
        withCredentials: true,
      });
      alert("School deleted successfully");

      const schools = await fetchSchools();
      setAllSchools(schools);
    } catch (error) {
      console.log("Error deleting school:", error);
      alert("Failed to delete school. Please try again later.");
    }
  };

  if (error) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>All schools</h1>
        {user?.isAdmin && (
          <Button
            variant="primary"
            onClick={() => {
              setError("");
              setShowCreateSchoolModal(true);
            }}
          >
            Create new school
          </Button>
        )}
        <strong style={{ color: "red" }}>{error}</strong>
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
      <h1>All schools</h1>
      {user?.isAdmin && (
        <Button
          variant="primary"
          onClick={() => setShowCreateSchoolModal(true)}
        >
          Create new school
        </Button>
      )}

      <div style={{ marginTop: "10px" }}>
        {allSchools?.length ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allSchools.map((school) => (
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
                    {user?.isAdmin && (
                      <Button
                        variant="danger"
                        className="ms-2"
                        onClick={() => deleteSchool(school.id)}
                      >
                        Delete school
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <strong>No schools available.</strong>
        )}
      </div>

      <CreateSchoolModal
        showCreateSchoolModal={showCreateSchoolModal}
        setCreateSchoolModal={setShowCreateSchoolModal}
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
