"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // Fetch user data from localStorage on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  // Fetch courses only when `userData` is available
  useEffect(() => {
    if (!userData?.token) return; // Ensure token is available

    const fetchCourses = async () => {
      setLoading(true); // Set loading to true at the start
      try {
        const response = await fetch(`${apiUrl}/api/v1/institute-courses/1`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        });

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
  }, [userData?.token]); // Trigger only when token changes

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={userData?.roles[0]?.role || "teacher"} />
      <SwitchUser roles={userData?.roles || []} />
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
