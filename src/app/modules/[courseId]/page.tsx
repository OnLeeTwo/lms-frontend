"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getModulesByCourseId } from "@/services/moduleService";
import { Module } from "@/types/module";

const CourseModules = () => {
  const { courseId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false); // State to track loading status
  const [modules, setModules] = useState<Module[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");

  useEffect(() => {
    const currentRole = sessionStorage.getItem("currentRole");

    if (currentRole) {
      setCurrentRole(currentRole);
    }
  }, []);

  useEffect(() => {
    if (currentRole === "instructor") {
      router.push("/instructor/modules");
    } else {
      const fetchModules = async () => {
        setLoading(true); // Set loading to true at the start
        try {
          if (typeof courseId === "string") {
            const response = await getModulesByCourseId(courseId);
            setModules(response.modules);
          } else {
            console.error("Invalid courseId:", courseId);
          }
        } catch (error) {
          console.error("Error fetching Modules:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchModules();
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={"teacher"} />
      <div className="p-8 flex-1">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Course Modules</h1>
              <p className="text-muted-foreground">Course ID: {courseId}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 ">
          {(() => {
            if (loading) {
              return <LoadingSpinner />;
            } else if (modules.length === 0) {
              return <p>No modules found for this course.</p>;
            } else {
              return (
                <>
                  {modules.map((module) => (
                    <Card key={module.module_id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {module.title}
                          </h3>
                        </div>
                        <Button variant="outline">Start Module</Button>
                      </div>
                    </Card>
                  ))}
                </>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default CourseModules;
