"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CourseCard } from "@/components/CourseCard";
import SwitchUser from "@/components/SwitchUser";
import { apiUrl } from "@/lib/env";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  enrolledCount: number;
  media: string;
}

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false); // Track loading state
  const [selectedInstituteId, setSelectedInstituteId] = useState<number>(1); // Track selected institute ID
  const [currentRole, setCurrentRole] = useState<string>(""); // Track selected institution's role

  // Fetch user data from localStorage on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);

      // Set initial role from the first institution in the roles
      const initialRole =
        parsedUserData.roles.find(
          (role: Role) => role.institute_id === selectedInstituteId
        )?.role || "student"; // Default to student if no role found
      setCurrentRole(initialRole);
    }
  }, []);

  // Fetch courses only when `userData` and `selectedInstituteId` are available and role is not 'admin'
  useEffect(() => {
    if (!userData?.token || currentRole === "admin") return; // Skip fetching courses if role is 'admin'

    const fetchCourses = async () => {
      setLoading(true); // Set loading to true at the start
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/institute-courses/${selectedInstituteId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        // Transform the data to match the CourseCardProps structure
        const transformedCourses = data.Courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: "Unknown", // Placeholder
          enrolledCount: Math.floor(Math.random() * 100) + 1, // Placeholder
          media: course.media,
        }));
        setCourses(transformedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchCourses();
  }, [userData?.token, selectedInstituteId, currentRole]); // Trigger only when token, selectedInstituteId, or role changes

  const handleInstituteChange = (instituteId: number) => {
    setSelectedInstituteId(instituteId);

    // Set the role for the selected institution
    const roleForInstitute =
      userData?.roles.find((role) => role.institute_id === instituteId)?.role ||
      "student"; // Default to student if no role found
    setCurrentRole(roleForInstitute);
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
              alt={`${userData?.user.name}'s Profile Picture`}
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

        <section aria-labelledby="courses-heading">
          <h2 id="courses-heading" className="text-2xl font-semibold mb-4">
            Your Courses
          </h2>
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
