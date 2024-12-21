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
  media: string;
}

export const CourseCard = ({
  id,
  title,
  description,
  media,
}: CourseCardProps) => {
  const router = useRouter();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="aspect-video mb-4 overflow-hidden rounded-md">
        <img
          src={media}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button onClick={() => router.push(`${id}/modules`)} className="w-full">
        View Modules
      </Button>
    </Card>
  );
};
