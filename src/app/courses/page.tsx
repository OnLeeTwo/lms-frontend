"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { CourseCard } from "@/components/CourseCard";
import { getToken } from "@/lib/getToken";
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
  const router = useRouter();
  const token = getToken();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [selectedInstituteId, setSelectedInstituteId] = useState<number>(1); // Track selected institute ID
  const [currentRole, setCurrentRole] = useState<string>(""); // Track selected institution's role

  // Fetch courses only when `userData` and `selectedInstituteId` are available and role is not 'admin'
  useEffect(() => {
    const currentRole = sessionStorage.getItem("currentRole");
    const selectedInstituteId = sessionStorage.getItem("instituteId");

    if (currentRole && selectedInstituteId) {
      setCurrentRole(currentRole);
      setSelectedInstituteId(Number(selectedInstituteId));
    }

    if (currentRole === "instructor") {
      router.push("/instructor/courses");
    } else {
      const fetchCourses = async () => {
        setLoading(true); // Set loading to true at the start
        try {
          const response = await fetch(
            `${apiUrl}/api/v1/institute-courses/${selectedInstituteId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar dynamically updates based on the current role */}
      <Sidebar role="student" />
      <div
        className="flex flex-col justify-items-center p-5 bg-white shadow-md rounded-lg"
        aria-labelledby="courses-heading"
      >
        <h2 id="courses-heading" className="text-2xl font-semibold mb-4">
          Your Courses
        </h2>
        {(() => {
          if (loading) {
            return (
              <div className="flex justify-center items-center">
                <LoadingSpinner />
              </div>
            );
          } else if (courses.length === 0) {
            return (
              <p className="text-lg font-medium text-gray-500">
                No courses found.
              </p>
            );
          } else {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default Index;
