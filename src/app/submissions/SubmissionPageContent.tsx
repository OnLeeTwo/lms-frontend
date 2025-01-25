"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getMySubmissionbyAssessmentId } from "@/services/submissionService";
import { SubmissionData, Submission } from "@/types/submission";

export default function SubmissionPageContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");
  const [submissionResponse, setSubmissionResponse] =
    useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSubmission = async () => {
      if (!assessmentId) return;

      try {
        setLoading(true);
        const data: SubmissionData = await getMySubmissionbyAssessmentId(
          assessmentId
        );
        setSubmissionResponse(data);
      } catch (error) {
        console.error("Failed to fetch submission", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="flex bg-background">
        <Sidebar role="student" />
        <div className="flex flex-col items-center justify-center min-h-screen flex-grow">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!submissionResponse || !submissionResponse.submissions.length) {
    return (
      <div className="flex bg-background">
        <Sidebar role="student" />
        <div className="flex flex-col items-center justify-center min-h-screen flex-grow">
          <h1 className="text-2xl font-bold">No Results Found</h1>
          <p className="text-gray-600 mt-4">
            Please complete an assessment to view your submission.
          </p>
        </div>
      </div>
    );
  }

  const submission = submissionResponse.submissions[0];

  return (
    <div className="flex bg-background">
      <Sidebar role="student" />
      <div className="flex flex-col items-center min-h-screen flex-grow p-8">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Assessment #{assessmentId}</h1>
            <div className="flex justify-between mt-2">
              <p>Score: {submission.score}</p>
            </div>
          </div>

          {submission.answer && (
            <div>
              {Object.entries(submission.answer).map(
                ([question, selectedOption], index) => (
                  <div key={index} className="mb-4 p-4 rounded-lg bg-gray-50">
                    <h3 className="font-bold mb-2">{question}</h3>
                    <p>
                      Your Answer:{" "}
                      <span className="font-semibold">{selectedOption}</span>
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
