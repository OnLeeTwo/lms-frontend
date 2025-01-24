// src/app/modules/[courseId]/[moduleId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Tiptap from "@/components/Tiptap";
import { Module } from "@/types/module";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, FileText, ClipboardList } from "lucide-react";

import { getModuleById, updateModule } from "@/services/moduleService";
import { getAssessmentsByModuleId } from "@/services/assessmentService";
import { Assessment } from "@/types/assessment";

const ModuleDetail = () => {
  const pathname = usePathname();
  const router = useRouter();

  const regex = /\/modules\/([^/]+)\/details\/([^/]+)/;
  const match = regex.exec(pathname || "");

  const courseId = match?.[1];
  const moduleId = match?.[2];
  const [module, setModule] = useState<Partial<Module> | undefined>();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (typeof moduleId === "string") {
          const [moduleData, assessmentData] = await Promise.all([
            getModuleById(moduleId, courseId),
            getAssessmentsByModuleId(moduleId),
          ]);
          setModule(moduleData);
          setAssessments(assessmentData);
        } else {
          throw new Error("Invalid moduleId");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch module details or assessments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, courseId, toast]);

  const handleViewDetails = (assessment: Assessment) => {
    const assessmentId = assessment.id.toString();
    router.push(`/assessments/${assessmentId}?type=${assessment.type}`);
  };

  const handleViewSubmission = (assessment: Assessment) => {
    router.push(`/submissions?assessment_id=${assessment.id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="student" />
        <div className="p-8 flex-1">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

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
      <Sidebar role="student" />
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
                Last updated{" "}
                {new Date(module.updated_at ?? "empty").toLocaleDateString()}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Content</h2>
            <div className="prose max-w-none">
              <Tiptap content={module.content} />
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
                      <Button
                        onClick={() => handleViewDetails(assessment)}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleViewSubmission(assessment)}
                        variant="outline"
                        size="sm"
                      >
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
