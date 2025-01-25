"use client";

import React, { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import SubmissionPageContent from "./SubmissionPageContent";

export default function SubmissionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex bg-background">
          <div className="flex flex-col items-center justify-center min-h-screen flex-grow">
            <LoadingSpinner />
          </div>
        </div>
      }
    >
      <SubmissionPageContent />
    </Suspense>
  );
}
