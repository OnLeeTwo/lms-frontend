import {
  LogOut,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  Shield,
  Landmark,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role: string;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const router = useRouter();
  const menuItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Users, label: "Profile", href: "/profile" },
    ...(role === "instructor" || role === "teacher"
      ? [
          {
            icon: GraduationCap,
            label: "Instructor Dashboard",
            href: `/dashboard`,
          },
        ]
      : []),
    ...(role === "student"
      ? [
          {
            icon: BookOpen,
            label: "Student Dashboard",
            href: `/dashboard`,
          },
        ]
      : []),
    ...(role === "admin"
      ? [
          {
            icon: Shield,
            label: "User Management",
            href: "/admin", // Admin-specific page
          },
          {
            icon: Shield,
            label: "Enrollment Management",
            href: "/admin/enrollment", // Admin-specific page
          },
          {
            icon: Shield,
            label: "Role Management",
            href: "/admin/role", // Admin-specific page
          },
          {
            icon: Shield,
            label: "Institute Management",
            href: "/admin/institution", // Admin-specific page
          },
        ]
      : []),
  ];

  const handleSignOut = () => {
    // Remove userData from local storage
    localStorage.removeItem("userData");
    sessionStorage.removeItem("currentRole");
    sessionStorage.removeItem("instituteId");
    // Redirect to the index page
    router.push("/login");
  };

  return (
    <nav className="h-screen w-64 bg-primary p-4 text-primary-foreground sticky top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold ">
          <a href="/dashboard">
            <img
              src="/logo.png"
              alt="SahabatAjar.id"
              className="w-full h-auto"
            />
          </a>
        </h1>
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
