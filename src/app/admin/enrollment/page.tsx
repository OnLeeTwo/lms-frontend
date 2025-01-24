"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaHammer } from "react-icons/fa";
import { Sidebar } from "@/components/Sidebar";

const UnderConstruction = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Adjust the route as necessary
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main content area */}
      <div className="flex-1 p-8">
        <div className="text-center p-8 rounded-lg shadow-lg bg-card w-full max-w-lg mx-auto">
          <FaHammer className="mx-auto text-6xl text-primary mb-4" />
          <h1 className="text-3xl font-semibold text-primary">
            Page Under Construction
          </h1>
          <p className="mt-4 text-muted-foreground">
            We&apos;re working hard to bring you this feature. Please check back
            later!
          </p>
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="mt-6 text-white bg-primary hover:bg-secondary"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
