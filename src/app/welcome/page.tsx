"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Rocket, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addInstitute } from "@/services/instituteService";
import { Institute } from "@/types/institute";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";

const InstituteSchema = z.object({
  name: z.string().min(3, "Institute name must be at least 3 characters"),
});

const WelcomeDashboard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parsedUserData, setParsedUserData] = useState<{
    user: { name: string };
    roles: string[];
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(InstituteSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    // Access localStorage safely in the client
    const storedUserData = localStorage.getItem("userData");
    const userData = storedUserData ? JSON.parse(storedUserData) : null;

    setParsedUserData(userData);

    if (userData?.roles?.length > 0) {
      router.push("/dashboard");
    }
  }, [router]);

  if (!parsedUserData) {
    return <div>Loading...</div>; // Optional: Add a loading state
  }

  const user = parsedUserData.user;

  const onSubmit = async (data: Partial<Institute>) => {
    try {
      const { name } = data;

      if (name) {
        await addInstitute(name);
      } else {
        throw new Error("Institute name is required");
      }
      setDialogOpen(false);
      router.push("/login");
      toast({
        title: "Institute Created",
        description:
          "You have successfully created your institute!, please login again to continue",
        variant: "default",
      });
    } catch (error) {
      console.error("Institute creation failed:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">
            Let's get started with your learning journey
          </p>
        </div>
        <UserCircle size={64} className="text-primary" />
      </div>

      <div className="flex flex-col justify-center">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Quick Start</CardTitle>
            <Rocket className="text-primary" />
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  Create my own institute and become admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Your Institute</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institute Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter institute name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Institute
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ask for the admin to enroll you in a institute</li>
            <li>
              You can accept invitation to join a institute by checking your
              email (TBD)
            </li>
            <li>Or you can start your own institute!</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log out</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="submit" className="w-full">
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeDashboard;
