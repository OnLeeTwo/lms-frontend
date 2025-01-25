import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, School } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <School className="w-10 h-10 text-red-600" />,
      title: "Easy Management",
      description:
        "Join as an institution and manage your students & instructor easily",
    },
    {
      icon: <BookOpen className="w-10 h-10 text-blue-600" />,
      title: "High-Quality Content",
      description:
        "Access thousands of learning materials from top instructors",
    },
    {
      icon: <GraduationCap className="w-10 h-10 text-green-600" />,
      title: "Real-time Feedback Assessment",
      description: "Interactive and measurable examination system",
    },
    {
      icon: <Users className="w-10 h-10 text-purple-600" />,
      title: "Learning Community",
      description: "Connect with fellow students and instructors",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="container mx-auto px-4 py-6 flex justify-between">
        <div className="flex items-start">
          <img
            src="/logo-landing.png"
            alt="SahabatAjar Logo"
            className="w-12 h-12 mr-2"
          />
          <div className="relative w-full pb-[12.5%] mt-3">
            <img
              src="/logo-text.png"
              alt="SahabatAjar text"
              className="object-cover w-[30%] h-[30%]"
            />
          </div>
        </div>
        <nav>
          <Link href="/login">
            <Button variant="outline" className="mr-4">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 mt-6">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Teach Easier, Learn Faster, Grow Smarter!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              The best online learning platform for students and educators
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Start Learning for Free
              </Button>
            </Link>
          </div>
          <div>
            <img
              src="/banner.jpg"
              alt="Learning Platform"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </section>

        <section className="mt-24">
          <h3 className="text-center text-4xl font-bold mb-16">Key Features</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-24 bg-blue-600 text-white rounded-xl p-16 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h3>
          <p className="text-xl mb-8">
            Join other people who have achieved success with SahabatAjar.id
          </p>
          <Link href="/register">
            <Button
              variant="secondary"
              size="lg"
              className="text-blue-600 hover:bg-white"
            >
              Sign Up Now
            </Button>
          </Link>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">
          © 2024 SahabatAjar.id - Best Online Learning Platform
        </p>
      </footer>
    </div>
  );
}
