"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Trash2, Plus } from "lucide-react";
import { deleteModule, getModulesByCourseId } from "@/services/moduleService";
import { Module } from "@/types/module";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CourseModules = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false); // State to track loading status
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module>(); // State to store selected modules
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog
  const [currentRole, setCurrentRole] = useState<string>("");

  useEffect(() => {
    const currentRole = sessionStorage.getItem("currentRole");

    if (currentRole) {
      setCurrentRole(currentRole);
    }
  }, []);

  useEffect(() => {
    if (currentRole === "instructor") {
      router.push("/modules-instructor");
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

  const handleAddModule = () => {
    router.push(`${courseId}/add`);
  };

  const handleViewModule = (moduleId: number) => {
    const moduleID = moduleId.toString();
    router.push(`${courseId}/details/${moduleID}`);
  };

  const handleDeleteClick = (Module: Module) => {
    setSelectedModule(Module);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedModule) return;

    try {
      if (typeof courseId === "string") {
        await deleteModule(courseId, selectedModule.id.toString());
        setModules(modules.filter((Module) => Module.id !== selectedModule.id));
        toast({
          title: "Success",
          description: "Module deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete Module",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

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
            <Button onClick={handleAddModule}>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </div>
        </header>

        <div className="grid gap-6 ">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {modules.map((module, index) => (
                <Card key={`${module.id}-${index}`} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {module.title}
                      </h3>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleViewModule(module.id)}
                      >
                        View Module
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteClick(module)}
                      >
                        <Trash2 className="mr-0.5 h-4 w-4" />
                        Delete Module
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedModule?.title}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseModules;
