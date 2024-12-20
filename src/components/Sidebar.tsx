import { Home, BookOpen, Users, Settings, GraduationCap } from "lucide-react";

interface SidebarProps {
  role: string;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "Courses", href: "/" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Users, label: "Profile", href: "/profile" },
    // ...(role === "teacher"
    //   ? [
    //       {
    //         icon: GraduationCap,
    //         label: "Grade Submissions",
    //         href: `/course/test/grading`,
    //       },
    //     ]
    //   : []),
    // ...(role !== "student"
    //   ? [{ icon: Users, label: "Users", href: "/users" }]
    //   : []),
    // ...(role === "admin"
    //   ? [{ icon: Settings, label: "Settings", href: "/settings" }]
    //   : []),
  ];

  return (
    <nav className="h-screen w-64 bg-primary p-4 text-primary-foreground">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">LMS Portal</h1>
      </div>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
