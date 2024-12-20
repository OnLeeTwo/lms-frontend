import { Sidebar } from "@/components/Sidebar";
import { CourseCard } from "@/components/CourseCard";
import SwitchUser from "@/components/SwitchUser";


const mockCourses = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals of computer science and programming.",
    instructor: "Dr. Smith",
    enrolledCount: 156,
  },
  {
    id: 2,
    title: "Advanced Mathematics",
    description:
      "Explore complex mathematical concepts and their applications.",
    instructor: "Prof. Johnson",
    enrolledCount: 89,
  },
  {
    id: 3,
    title: "Digital Marketing Essentials",
    description: "Master the basics of digital marketing and social media.",
    instructor: "Sarah Wilson",
    enrolledCount: 234,
  },
];

const Index = () => {
  const userRole = "teacher" as const;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={userRole} />
      <SwitchUser/>
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Welcome back, Teacher
          </h1>
          <p className="text-muted-foreground">
            Manage your courses and students
          </p>
        </header>

        <section aria-labelledby="courses-heading">
          <h2 id="courses-heading" className="text-2xl font-semibold mb-4">
            Your Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
