"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
}

const mockModules: Module[] = [
  {
    id: 1,
    title: "Introduction to the Course",
    description: "Overview of what you'll learn in this course",
    duration: "1 hour",
  },
  {
    id: 2,
    title: "Core Concepts",
    description: "Understanding the fundamental principles",
    duration: "2 hours",
  },
  {
    id: 3,
    title: "Advanced Topics",
    description: "Deep dive into complex subjects",
    duration: "3 hours",
  },
];

const CourseModules = () => {
  const { courseId } = useParams();
  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar role={"user"} />
        <div className="p-8 flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Course Modules</h1>
            <p className="text-muted-foreground">Course ID: {courseId}</p>
          </header>

          <div className="grid gap-6 ">
            {mockModules.map((module) => (
              <Card key={module.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {module.description}
                    </p>
                    <p className="text-sm">Duration: {module.duration}</p>
                  </div>
                  <Button variant="outline">Start Module</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseModules;
