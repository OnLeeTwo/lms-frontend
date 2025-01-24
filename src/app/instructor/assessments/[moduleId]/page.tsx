"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, Edit, Plus, FileSpreadsheet } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Assessment } from "@/types/assessment";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAssessmentsByModuleId } from "@/services/assessmentService";
import { useParams, useRouter } from "next/navigation";

const AssessmentManagementPage: React.FC = () => {
  const router = useRouter();
  const { moduleId } = useParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<
    Partial<Assessment>
  >({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (typeof moduleId === "string") {
          const assessments = await getAssessmentsByModuleId(moduleId);
          setAssessments(assessments);
        } else {
          throw new Error("Invalid moduleId");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  const handleCreate = () => {
    const newAssessment: Assessment = {
      ...currentAssessment,
      id: String(assessments.length + 1),
    } as Assessment;

    setAssessments([...assessments, newAssessment]);
    setIsDialogOpen(false);
    setCurrentAssessment({});
  };

  const handleUpdate = () => {
    setAssessments(
      assessments.map((a) =>
        a.id === currentAssessment.id ? (currentAssessment as Assessment) : a
      )
    );
    setIsDialogOpen(false);
    setCurrentAssessment({});
  };

  const handleDelete = (id: string) => {
    setAssessments(assessments.filter((a) => a.id !== Number(id)));
  };

  const openEditDialog = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setCurrentAssessment({});
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="teacher" />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Course Assessments</CardTitle>
            <Button onClick={openCreateDialog} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Assessment
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>{assessment.id}</TableCell>
                      <TableCell>{assessment.type}</TableCell>
                      <TableCell>{assessment.created_at}</TableCell>
                      <TableCell>{assessment.updated_at}</TableCell>
                      <TableCell className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                size="icon"
                                onClick={() =>
                                  router.push(
                                    `/instructor/assessments/details/${assessment.id}`
                                  )
                                }
                              >
                                <FileSpreadsheet className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Details</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openEditDialog(assessment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  handleDelete(String(assessment.id))
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create"
                  ? "Create Assessment"
                  : "Edit Assessment"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <select
                  id="type"
                  value={currentAssessment.type ?? ""}
                  className="col-span-3 p-2 border rounded"
                  onChange={(e) =>
                    setCurrentAssessment({
                      ...currentAssessment,
                      type: e.target.value as Assessment["type"],
                    })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="choices">Choices</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={dialogMode === "create" ? handleCreate : handleUpdate}
              >
                {dialogMode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssessmentManagementPage;
