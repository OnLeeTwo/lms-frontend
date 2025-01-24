"use client";
import React, { useState } from "react";
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
import * as z from "zod";

const InstituteSchema = z.object({
  name: z.string().min(3, "Institute name must be at least 3 characters"),
});

const WelcomeDashboard = () => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const storedUserData = localStorage.getItem("userData");
  const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

  if (parsedUserData.roles.length > 0) {
    router.push("/dashboard");
  }

  const user = parsedUserData.user;

  const form = useForm({
    resolver: zodResolver(InstituteSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addInstitute(data);

      const updatedUserData = {
        ...parsedUserData,
        roles: [...parsedUserData.roles, "institute_admin"],
      };

      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      setDialogOpen(false);
      router.push("/dashboard");
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
    </div>
  );
};

export default WelcomeDashboard;
