// src/app/modules/[courseId]/[moduleId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Tiptap from "@/components/Tiptap";
import { Module } from "@/types/module";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  ClipboardList,
  Save,
  X,
} from "lucide-react";

import { getModuleById } from "@/services/moduleService";
import { getAssessmentsByModuleId } from "@/services/assessmentService";
import { Assessment } from "@/types/assessment";

export const mockAssessmentData: Assessment[] = [
  {
    id: 1,
    module_id: 101,
    type: "Essay",
    created_at: "2024-12-17T10:00:00",
    updated_at: "2024-12-17T10:30:00",
  },
  {
    id: 2,
    module_id: 102,
    type: "Choices",
    created_at: "2024-12-18T12:00:00",
    updated_at: "2024-12-18T12:45:00",
  },
  {
    id: 3,
    module_id: 103,
    type: "Essay",
    created_at: "2024-12-19T14:00:00",
    updated_at: "2024-12-19T14:30:00",
  },
  {
    id: 4,
    module_id: 104,
    type: "Choices",
    created_at: "2024-12-20T09:00:00",
    updated_at: "2024-12-20T09:30:00",
  },
  {
    id: 5,
    module_id: 105,
    type: "Essay",
    created_at: "2024-12-21T11:00:00",
    updated_at: "2024-12-21T11:20:00",
  },
];

export const mockModuleData = {
  module_id: 123,
  title: "Introduction to Modern Web Development",
  content: `
  <h1>Course Overview </h1><p>Web development is a dynamic and exciting field that continues to evolve rapidly. In this module, we'll explore the fundamental technologies and principles that power modern web applications.  </p><h2>Key Learning Objectives </h2><ul><li><p>Understand the core technologies of web development</p></li><li><p>Learn about frontend and backend architectures </p></li><li><p>Explore best practices in responsive design </p></li><li><p>Gain insights into modern JavaScript frameworks </p></li></ul><h2>Technologies We'll Cover </h2><ol><li><p>HTML5 and semantic markup </p></li><li><p>CSS3 with flexbox and grid layouts </p></li><li><p>JavaScript and ES6+ features </p></li><li><p>React.js fundamentals </p></li><li><p>Next.js for server-side rendering </p></li></ol><pre class="rounded-md bg-muted p-4 font-mono text-sm"><code>Note: This is an introductory module designed for beginners with basic programming knowledge.</code></pre><p></p>`,
  module_file: "https://example.com/web-dev-intro-materials.pdf",
  created_at: "2024-02-15T10:30:00Z",
  updated_at: "2024-03-22T14:45:30Z",
  course_id: 123,
};

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const router = useRouter();
  const [module, setModule] = useState<Module | undefined>();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  //mocks
  useEffect(() => {
    setModule(mockModuleData as Module);
    // setAssessments(mockAssessmentData);

    const fetchAssessments = async () => {
      setLoading(true);
      setError(null);

      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        setError("User data not found. Please log in.");
        setLoading(false);
        return;
      }

      const { token, roles } = JSON.parse(storedUserData);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/modules/9/assessments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch modules. Please try again later.");
        }

        const data = await response.json();
        setAssessments(data.assessments);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (content: string) => {
    try {
      // Here you would normally make an API call to save the content
      const updatedModule = {
        ...module!,
        content: content,
        updated_at: new Date().toISOString(),
      };
      setModule(updatedModule);
      setIsEditing(false);
      console.log("Updated module content:", updatedModule);

      toast({
        title: "Success",
        description: "Module content updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update module content",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  //Real

  //   useEffect(() => {
  //     const fetchModule = async () => {
  //       try {
  //         const data = await getModuleById();
  //         setModule(data);
  //       } catch (error) {
  //         toast({
  //           title: "Error",
  //           description: "Failed to fetch module details",
  //           variant: "destructive",
  //         });
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchModule();
  //   }, [moduleId, toast]);

  //   if (loading) {
  //     return (
  //       <div className="flex min-h-screen bg-background">
  //         <Sidebar role="teacher" />
  //         <div className="p-8 flex-1">
  //           <div className="flex items-center justify-center h-full">
  //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  if (!module) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="teacher" />
        <div className="p-8 flex-1">
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold">Module not found</h3>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="teacher" />
      <div className="p-8 flex-1">
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modules
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{module.title}</h1>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                Last updated {new Date(module.updated_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={handleEdit}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Module
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Module
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          <Card className="p-6">
            <h1 className="text-xl font-semibold mb-4">Content</h1>
            <div
              className={`prose max-w-none ${
                isEditing ? "border rounded-md p-4" : ""
              }`}
            >
              <Tiptap
                content={module.content}
                editable={isEditing}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </Card>
          {module.module_file && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Materials</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>File 1</span>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => window.open(module.module_file, "_blank")}
                >
                  Download
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Assessments</h2>
              <Button>
                <ClipboardList className="mr-2 h-4 w-4" />
                Add Assessment
              </Button>
            </div>
            {assessments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No assessments available for this module.
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">
                          Assessment #{assessment.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {assessment.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/assessments/${assessment.id}`)}>
                        View Submissions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
