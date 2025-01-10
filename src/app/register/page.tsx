"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Eye, EyeOff } from "lucide-react";
import { apiUrl } from "@/lib/env";

const RegisterPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(true);

  interface RegisterValues {
    name: string;
    email: string;
    password: string;
    profilePict: File | null;
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("*name is required"),
    email: Yup.string()
      .email("*invalid email address")
      .required("*email is required"),
    password: Yup.string()
      .min(6, "*password must be at least 6 characters")
      .required("*password is required"),
  });

  const handleSubmit = async (
    values: RegisterValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const { name, email, password, profilePict } = values;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePict) {
        formData.append("profile_pict", profilePict);
      }

      const response = await fetch(
        `${apiUrl}/api/v1/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Registrasi Berhasil!",
          description: `Selamat, ${data.name}! Anda telah berhasil mendaftar.`,
          className: "bg-green-400",
          duration: 1500,
        });
        router.push("/login");
      } else {
        const errorData = await response.json();
        toast({
          title: "Registrasi Gagal!",
          description:
            errorData.message || "Terjadi kesalahan saat registrasi.",
          className: "bg-red-400",
          duration: 1500,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Registrasi Gagal!",
          description: error.message || "Tidak dapat terhubung ke server.",
          className: "bg-red-400",
          duration: 1500,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues: RegisterValues = {
    name: "",
    email: "",
    password: "",
    profilePict: null,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              {/* Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 relative"
                >
                  Name
                  <span className="text-red-500">*</span>
                </label>
                <Field name="name" as={Input} placeholder="Enter your name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  name="email"
                  type="email"
                  as={Input}
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative w-full">
                  <Field
                    name="password"
                    type={visible ? "password" : "text"}
                    as={Input}
                    placeholder="Enter your password"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff /> : <Eye />}
                  </div>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Profile Picture */}
              <div className="mb-4">
                <label
                  htmlFor="profilePict"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <Input
                  type="file"
                  name="profilePict"
                  id="profilePict"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFieldValue("profilePict", file);
                  }}
                  accept="image/*"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
