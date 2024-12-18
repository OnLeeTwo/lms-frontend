"use client";
import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";



const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin", // Default role
  });

  const { toast } = useToast();
  const router = useRouter();

  const { username, email, password, role } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add API integration here to send the data to the backend
    if (email === "teacher@example.com" && password === "password" && role === "teacher" && username === "teacher") {
        toast({
          title: "registrasi Berhasil!",
          description: `Membawa anda ke profile page...`,
          className: "bg-green-400",
          duration: 1500,
        });
        router.push("/login");
      } else {
        console.error("Login failed!");
      }
  };

  const handleRoleChange = (role: string) => {
    setFormData({
      ...formData,
      role: role,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Daftar Sebagai</h2>

        {/* Role Selection Buttons */}
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => handleRoleChange("admin")}
            className={`w-full px-6 py-2 rounded-l-md font-medium ${
              formData.role === "admin" ? "bg-black text-white" : "bg-gray-200"
            } hover:bg-gray-600 focus:outline-none`}
          >
            Admin
          </button>
          <button
            onClick={() => handleRoleChange("teacher")}
            className={`w-full px-6 py-2 rounded-r-md font-medium ${
              formData.role === "teacher" ? "bg-black text-white" : "bg-gray-200"
            } hover:bg-gray-600 focus:outline-none`}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full "
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
