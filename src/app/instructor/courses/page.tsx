"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Plus } from "lucide-react";
import { Course } from "@/types/course";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/lib/getToken";
import { apiUrl } from "@/lib/env";
import { deleteCourse } from "@/services/coursesService";

const Courses = () => {
  const router = useRouter();
  const token = getToken();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>(""); // Track selected institution's role
  const [selectedInstituteId, setSelectedInstituteId] = useState<number>(1);

  // Fetch user data from localStorage on mount
  useEffect(() => {
    const currentRole = sessionStorage.getItem("currentRole");
    const selectedInstituteId = sessionStorage.getItem("instituteId");

    if (currentRole && selectedInstituteId) {
      setCurrentRole(currentRole);
      setSelectedInstituteId(Number(selectedInstituteId));
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true); // Set loading to true at the start
      try {
        const response = await fetch(`${apiUrl}/api/v1/courses`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        if (!data) {
          throw new Error("Courses is empty");
        }

        setCourses(data.Courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourses = () => {
    router.push("/instructor/courses/add");
  };

  const handleEditCourse = (courseId: number) => {
    router.push(`/instructor/courses/edit/${courseId}`);
  };

  const handleViewCourse = (courseId: number) => {
    router.push(`/instructor/modules/${courseId}`);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourse) return;

    try {
      await deleteCourse(selectedCourse.id);

      setCourses(courses.filter((course) => course.id !== selectedCourse.id));
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar role="teacher" />
        <div className="p-8 flex-1">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Courses</h1>
              </div>
              <Button onClick={handleAddCourses}>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </div>
          </header>

          <div className="grid gap-6">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {courses.map((course) => (
                  <Card key={course.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {course.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {course.description}
                        </p>
                        <p className="text-sm">Category: {course.category}</p>
                      </div>
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => handleEditCourse(course.id)}
                        >
                          Edit Course
                        </Button>
                        <Button
                          className="bg-red-500 text-white"
                          variant="outline"
                          onClick={() => handleDeleteClick(course)}
                        >
                          Delete Course
                        </Button>
                        <Button
                          className="bg-black text-white"
                          variant="outline"
                          onClick={() => handleViewCourse(course.id)}
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
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
              This will permanently delete {selectedCourse?.title}. This action
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
    </>
  );
};

export default Courses;
