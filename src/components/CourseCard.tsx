"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  instructor: string;
  enrolledCount: number;
}

export const CourseCard = ({
  id,
  title,
  description,
  instructor,
  enrolledCount,
}: CourseCardProps) => {
  const router = useRouter();

  // Select an appropriate image based on the course ID
  const getImageUrl = (courseId: number) => {
    const images = [
      "photo-1488590528505-98d2b5aba04b",
      "photo-1486312338219-ce68d2c6f44d",
      "photo-1498050108023-c5249f4df085",
    ];
    const index = (courseId - 1) % images.length;
    return `https://images.unsplash.com/${images[index]}?auto=format&fit=crop&w=800&q=80`;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="aspect-video mb-4 overflow-hidden rounded-md">
        <img
          src={getImageUrl(id)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
        <span>Instructor: {instructor}</span>
        <span>{enrolledCount} enrolled</span>
      </div>
      <Button onClick={() => router.push(`/modules/${id}`)} className="w-full">
        View Modules
      </Button>
    </Card>
  );
};
