"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound, BookOpen, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { apiUrl } from "@/lib/env";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<{
    token: string | null;
    name: string;
    email: string;
    avatar: string;
    enrolledCourses: number;
    institutions: { id: number; name: string; role: string }[];
  }>({
    token: null,
    name: "Fetching....",
    email: "fetching@get.com",
    avatar: "/placeholder.svg",
    enrolledCourses: 0,
    institutions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data (token and institutions) from localStorage
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        setError("User data not found. Please log in.");
        setLoading(false);
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      const { token, roles } = parsedUserData;

      // Extract institutions from roles
      const institutions =
        roles?.map((role: any) => ({
          id: role.institute_id,
          name: role.institute_name,
          role: role.role,
        })) || [];

      // Update userData with token and institutions
      setUserData((prev) => ({ ...prev, token, institutions }));

      // Fetch the full user profile data from the API
      try {
        const response = await fetch(`${apiUrl}/api/v1/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile. Please try again later.");
        }

        const data = await response.json();
        setUserData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
          avatar: data.profile_pict || "/placeholder.svg",
          enrolledCourses: 0, // Adjust this as needed based on the response
        }));
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>
                    <UserRound className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
              )}
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
