import { LogOut, BookOpen, Users, GraduationCap, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role: string;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const router = useRouter();
  const menuItems = [
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Users, label: "Profile", href: "/profile" },
    ...(role === "teacher"
      ? [
          {
            icon: GraduationCap,
            label: "Grade Submissions",
            href: `/course/test/grading`,
          },
        ]
      : []),
  ];

  const handleSignOut = () => {
    // Remove userData from local storage
    localStorage.removeItem("userData");
    // Redirect to the index page
    router.push("/");
  };

  return (
    <nav className="h-screen w-64 bg-primary p-4 text-primary-foreground">
      <div className="mb-8">
        <h1 className="text-2xl font-bold ">LMS Portal</h1>
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
        <li>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 p-2 w-full text-left rounded-md hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
