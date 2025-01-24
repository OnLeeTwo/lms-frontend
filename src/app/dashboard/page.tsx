"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Book,
  Library,
  ClipboardList,
  Gauge,
  User,
  GraduationCap,
  MailQuestion,
  School,
} from "lucide-react";
import SwitchUser from "@/components/SwitchUser";
import { withAuth } from "@/hooks/withAuth";

interface User {
  id: number;
  name: string;
  email: string;
  profile_pict: string;
}

interface Role {
  institute_id: number;
  institute_name: string;
  role: string;
  role_id: number;
}

interface UserData {
  user: User;
  roles: Role[];
  token: string;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedInstituteId, setSelectedInstituteId] = useState<number>(1); // Track selected institute ID
  const [currentRole, setCurrentRole] = useState<string>(""); // Track selected institution's role
  const [roleId, setRoleId] = useState<number>(1); // Track selected institution's role ID

  // Fetch user data from localStorage on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);

      if (parsedUserData.roles.length > 0) {
      }

      // Set initial role from the first institution in the roles
      const initialRole =
        parsedUserData.roles.find(
          (role: Role) => role.institute_id === selectedInstituteId
        )?.role || "student"; // Default to student if no role found

      const initialRoleId =
        parsedUserData.roles.find(
          (role: Role) => role.institute_id === selectedInstituteId
        )?.role_id || 1;

      setCurrentRole(initialRole);
      sessionStorage.setItem("currentRoleId", initialRoleId);
      sessionStorage.setItem("currentRole", initialRole);
      sessionStorage.setItem("instituteId", selectedInstituteId.toString());
    }
  }, []);

  const handleInstituteChange = (instituteId: number) => {
    setSelectedInstituteId(instituteId);

    // Set the role for the selected institution
    const roleForInstitute =
      userData?.roles.find((role) => role.institute_id === instituteId)?.role ||
      "student"; // Default to student if no role found

    const roleIdForInstitute =
      userData?.roles.find((role) => role.institute_id === instituteId)
        ?.role_id || 1;

    setCurrentRole(roleForInstitute);
    sessionStorage.setItem("currentRoleId", roleIdForInstitute.toString());
    sessionStorage.setItem("currentRole", roleForInstitute);
    sessionStorage.setItem("instituteId", instituteId.toString());
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar dynamically updates based on the current role */}
      <Sidebar role={currentRole} />

      {/* SwitchUser allows user to select the institution */}
      <SwitchUser
        roles={userData?.roles || []}
        onInstituteChange={handleInstituteChange}
      />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={userData?.user.profile_pict}
              alt={userData?.user.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Welcome back, {userData?.user.name}
              </h1>
              <p className="text-muted-foreground">{userData?.user.email}</p>

              {/* Display the role below the name */}
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Role: {currentRole}
              </p>
            </div>
          </div>
        </header>
        <section>
          {currentRole === "admin" && (
            <div className="grid grid-cols-2 gap-4 justify-center content-center">
              <a
                href="/admin"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <User className="mb-2 h-6 w-6" />
                User
              </a>
              <a
                href="/admin/institution"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <School className="mb-2 h-6 w-6" />
                Instituiton
              </a>
              <a
                href="/admin/role"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <MailQuestion className="mb-2 h-6 w-6" />
                Role
              </a>
              <a
                href="/admin/enrollment"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <GraduationCap className="mb-2 h-6 w-6" />
                Enrollment
              </a>
            </div>
          )}
          {currentRole === "instructor" && (
            <div className="grid grid-cols-2 gap-4 justify-center content-center">
              <a
                href="/instructor/courses"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <Book className="mb-2 h-6 w-6" />
                Courses
              </a>
              <a
                href="/instructor/module"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <Library className="mb-2 h-6 w-6" />
                Module
              </a>
              <a
                href="/instructor/submissions"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <ClipboardList className="mb-2 h-6 w-6" />
                Submission
              </a>
              <a
                href="/instructor/assessments"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <Gauge className="mb-2 h-6 w-6" />
                Assessment
              </a>
            </div>
          )}
          {currentRole === "student" && (
            <div className="grid grid-cols-2 gap-4 justify-center content-center">
              <a
                href="/courses"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <Book className="mb-2 h-6 w-6" />
                Courses
              </a>
              <a
                href="/modules"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <Library className="mb-2 h-6 w-6" />
                Module
              </a>
              <a
                href="/submissions"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <ClipboardList className="mb-2 h-6 w-6" />
                Submission
              </a>
              <a
                href="/assessments"
                className="flex flex-col place-items-center p-4 border-solid"
              >
                <Gauge className="mb-2 h-6 w-6" />
                Assessment
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default withAuth(Index);
