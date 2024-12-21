"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { apiUrl } from "@/lib/env";

import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [visible, setVisible] = useState<boolean>(true);

  interface LoginValues {
    email: string;
    password: string;
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (
    values: LoginValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userData", JSON.stringify(data));
        toast({
          title: "Log In Sukses!",
          description: `Welcome back, ${data.name}! Redirecting...`,
          className: "bg-green-400",
          duration: 1500,
        });
        router.push("/courses");
      } else {
        const errorData = await response.json();
        toast({
          title: "Log In Gagal!",
          description: errorData.message || "Invalid email or password.",
          className: "bg-red-400",
          duration: 1500,
        });
      }
    } catch {
      toast({
        title: "Log In Gagal!",
        description: "Failed to connect to the server.",
        className: "bg-red-400",
        duration: 1500,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">
            Please sign in to continue
          </p>
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    as={Input}
                    placeholder="Enter your email"
                    required
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <Field
                      id="password"
                      type={visible ? "password" : "text"}
                      name="password"
                      as={Input}
                      placeholder="Enter your password"
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
