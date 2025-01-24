"use client";
import React, { useState, useEffect } from "react";
import EssayQuiz from "@/components/Essay";
import MultipleChoiceQuiz from "@/components/MultipleChoices";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getAssessmentsDetails } from "@/services/assessmentService";
import { AssessmentDetails } from "@/types/assessment";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AssessmentDetailsPage({
  params,
}: {
  readonly params: { readonly assessment_id: string };
}) {
  const [assessmentDetails, setAssessmentDetails] =
    useState<AssessmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { assessment_id } = params;

  useEffect(() => {
    async function fetchAssessmentDetails() {
      try {
        setIsLoading(true);
        const response = await getAssessmentsDetails(assessment_id);
        setAssessmentDetails(response);
      } catch (error) {
        console.error("Error fetching assessment details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAssessmentDetails();
  }, [assessment_id]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="student" />
      {isLoading ? <LoadingSpinner /> : null}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Assessment Details</h1>
        {type === "choices" && assessmentDetails && (
          <MultipleChoiceQuiz assessment_details={assessmentDetails} />
        )}
        {type === "essay" && assessmentDetails && (
          <EssayQuiz assessment={assessmentDetails} />
        )}
        {!type && <p>Invalid assessment type.</p>}
      </div>
    </div>
  );
}
