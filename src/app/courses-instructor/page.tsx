"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Plus } from "lucide-react";
import { Course } from "@/types/course";
import { useToast } from "@/hooks/use-toast";

const mockCourses: Course[] = [
    {
        id: 1,
        role_id: 1,
        institute_id: 1,
        title: "Calculus",
        description: "Basic Calculus",
        category: "Math",
        media: "https://example.com/intro-video.mp4",
        created_at: "2023-08-15T10:30:00Z",
        updated_at: "2023-09-22T14:45:30Z",
    },
    {
        id: 2,
        role_id: 1,
        institute_id: 1,
        title: "Chemistry",
        description: "Basic Chemistry",
        category: "Science",
        media: "https://example.com/intro-video.mp4",
        created_at: "2023-08-15T10:30:00Z",
        updated_at: "2023-09-22T14:45:30Z",
    },
    {
        id: 3,
        role_id: 1,
        institute_id: 1,
        title: "Astronomy",
        description: "Intro to Astronomy",
        category: "Science",
        media: "https://example.com/intro-video.mp4",
        created_at: "2023-08-15T10:30:00Z",
        updated_at: "2023-09-22T14:45:30Z",
    },
];

const Courses = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [courses, setCourses] = useState(mockCourses);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const handleAddCourses = () => {
        router.push("/courses-instructor/add");
    };

    const handleEditCourse = (courseId: number) => {
        router.push(`/courses-instructor/edit/${courseId}`);
    };

    const handleDeleteClick = (course: Course) => {
        setSelectedCourse(course);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCourse) return;

        try {
            // Add API call here
            // await deleteCourse(selectedCourse.id);

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
                        {courses.map((course) => (
                            <Card key={course.id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                        <p className="text-muted-foreground mb-4">{course.description}</p>
                                        <p className="text-sm">Category: {course.category}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => handleEditCourse(course.id)}>
                                            Edit Course
                                        </Button>
                                        <Button variant="outline" onClick={() => handleDeleteClick(course)}>
                                            Delete Course
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete {selectedCourse?.title}. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default Courses;
