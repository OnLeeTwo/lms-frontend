"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Sidebar } from "../../../components/Sidebar";
import { LoadingSpinner } from "../../../components/ui/loading-spinner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Module {
  id: number;
  title: string;
  content: string;
  module_file: string | null;
}

const MAX_CONTENT_LENGTH = 200; // Maximum characters to display before truncation

const CourseModules = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError(null);

      // Retrieve user data from localStorage
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        setError("User data not found. Please log in.");
        setLoading(false);
        return;
      }

      const { token, roles } = JSON.parse(storedUserData);

      // Check user role (instructor or student)
      const isInstructor = roles.some(
        (role: any) => role.role === "instructor"
      );

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/${
            isInstructor ? "courses" : "student-courses"
          }/${courseId}/modules`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch modules. Please try again later.");
        }

        const data = await response.json();
        setModules(data.modules);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar with fixed height */}
      <Sidebar role={"user"} />
      <div className="p-8 flex-1">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Course Modules</h1>
          <p className="text-muted-foreground">Course ID: {courseId}</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid gap-6">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ModuleCard = ({ module }: { module: Module }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const displayedContent = isExpanded
    ? module.content
    : `${module.content.substring(0, MAX_CONTENT_LENGTH)}...`;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
          <p className="text-muted-foreground mb-4">{displayedContent}</p>
          {module.content.length > MAX_CONTENT_LENGTH && (
            <Button
              variant="link"
              onClick={handleToggle}
              className="text-blue-500 hover:underline p-0"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          )}
          {module.module_file && (
            <a
              href={module.module_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mt-2"
            >
              View Module File
            </a>
          )}
        </div>
        {/* <Button variant="outline">Start Module</Button> */}
      </div>
    </Card>
  );
};

export default CourseModules;
