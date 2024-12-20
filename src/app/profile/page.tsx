"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, BookOpen, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/Sidebar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
    enrolledCourses: 3,
    avatar: "/placeholder.svg",
    institutions: [
      {
        id: 1,
        name: "RevoU",
        role: "student",
      },
      {
        id: 2,
        name: "Udemy",
        role: "teacher",
      },
      {
        id: 3,
        name: "Coursera",
        role: "student",
      },
    ],
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r">
        <Sidebar role="teacher" />
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Profile Card */}
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>
                  <UserRound className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{userData.name}</h2>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{userData.enrolledCourses} Enrolled Courses</span>
            </div>
          </Card>

          {/* Profile Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex gap-4 mt-2">
                    <Input
                      id="name"
                      value={userData.name}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-4 mt-2">
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Institutions Card */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Institutions</h3>
                </div>
                <div className="divide-y">
                  {userData.institutions.map((institution) => (
                    <div
                      key={institution.id}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <h4 className="font-medium">{institution.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        Role: {institution.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
