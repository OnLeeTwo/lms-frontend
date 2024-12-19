"use client";
import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [profilePict, setProfilePict] = useState<File | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const { name, email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      setProfilePict(e.target.files[0]);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (email && password && name) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if(profilePict){
          formData.append("profile_pict", profilePict);
        }
  
        const response = await fetch("http://127.0.0.1:5000/api/v1/auth/register", {
          method: "POST",
          body: formData,
        });
  
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
            description: errorData.message || "Terjadi kesalahan saat registrasi.",
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
      }
    } else {
      toast({
        title: "Registrasi Gagal!",
        description: "Harap isi semua field dengan benar.",
        className: "bg-red-400",
        duration: 1500,
      });
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
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

          {/* Profile Picture */}
          <div className="mb-4">
            <label htmlFor="profilePict" className="block text-sm font-medium text-gray-700">
              Profile Picture
              <Input
                type="file"
                name="profilePict"
                id="profilePict"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
