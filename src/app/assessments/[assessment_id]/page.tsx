"use client";
import React, { useState, useEffect } from "react";
import EssayQuiz from "@/components/Essay";
import MultipleChoiceQuiz from "@/components/MultipleChoices";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getAssessmentsDetails } from "@/services/assessmentService";
import { AssessmentDetails } from "@/types/assessment";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getMySubmissionbyAssessmentId } from "@/services/submissionService";

export default function AssessmentDetailsPage({
  params: paramsPromise,
}: {
  readonly params: Promise<{ readonly assessment_id: string }>;
}) {
  const router = useRouter();
  const [assessmentDetails, setAssessmentDetails] =
    useState<AssessmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmission, setHasSubmission] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string>("1");
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await paramsPromise;
      setAssessmentId(resolvedParams.assessment_id);
    }
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (!assessmentId) return;

    async function fetchAssessmentDetails() {
      try {
        setIsLoading(true);
        const response = await getAssessmentsDetails(assessmentId);
        setAssessmentDetails(response);
      } catch (error) {
        console.error("Error fetching assessment details:", error);
      }
    }

    async function fetchMySubmission() {
      try {
        const response = await getMySubmissionbyAssessmentId(assessmentId);
        setHasSubmission(response.submissions.length > 0);
      } catch (error) {
        console.error("Error fetching submission:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssessmentDetails();
    fetchMySubmission();
  }, [assessmentId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="student" />
        <LoadingSpinner />;
      </div>
    );
  }

  if (hasSubmission) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role="student" />
        <div className="flex-1 flex-row items-center justify-center p-6">
          <h1 className="text-2xl font-bold">
            You already submitted this assessment.
          </h1>
          <p className="text-gray-600 mt-4">
            You can't submit this assessment again.
          </p>
          <button
            onClick={() =>
              router.push(`/submissions?assessment_id=${assessmentId}`)
            }
            className="mt-4"
          >
            Go see my submission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="student" />
      <div className="flex-1 flex-row items-center justify-center p-6">
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
