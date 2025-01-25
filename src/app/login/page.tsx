"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { apiUrl } from "@/lib/env";
import { Lock, Mail, LogIn } from "lucide-react";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleLogin = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userData", JSON.stringify(data));
        toast({
          title: "Login Successful",
          description: `Welcome, ${data.user.name}`,
          variant: "default",
          duration: 2000,
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
            <p className="text-gray-500">Access your account</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      as={Input}
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      as={Input}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <LogIn className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 rounded text-blue-500 focus:ring-blue-400"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-500 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-4 border-t pt-4">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-500 font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
