"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentDetails } from "@/types/assessment";
import { submitAssessment } from "@/services/submissionService";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function MultipleChoiceQuiz({
  assessment_details,
}: {
  assessment_details: AssessmentDetails | null;
}) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showScore, setShowScore] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  // Early return if no assessment
  if (!assessment_details) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Assessment Not Found</h1>
          <p className="text-gray-600 mt-4">
            The assessment data is not available.
          </p>
        </div>
      </div>
    );
  }

  const questions = Object.keys(assessment_details.question);
  const totalQuestions = questions.length;

  const roleId = sessionStorage.getItem("currentRoleId");

  const handleAnswer = (question: string, selectedOption: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    setShowConfirmation(false);
    setShowScore(true);

    const formData = new FormData();
    if (roleId) {
      formData.append("role_id", roleId);
    }
    formData.append("answer", JSON.stringify(selectedAnswers));
    async function submitData() {
      try {
        setLoading(true);
        await submitAssessment(
          String(assessment_details?.assessment_id),
          formData as Partial<AssessmentDetails>
        );
      } catch (error) {
        console.error("Error submitting assessment:", error);
      } finally {
        setLoading(false);
      }
    }
    submitData();
  };

  const calculateScore = () => {
    return assessment_details.answer
      ? Object.keys(assessment_details.answer).filter(
          (question) =>
            selectedAnswers[question] === assessment_details.answer?.[question]
        ).length
      : 0;
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full bg-gray-100 rounded-lg shadow-lg p-6">
          {showScore ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold">Your Score</h2>
              <p className="text-lg">
                {calculateScore()} out of {totalQuestions}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setShowScore(false);
                    setCurrentQuestionIndex(0);
                  }}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black"
                >
                  Restart Quiz
                </button>
                <button
                  onClick={() => router.back()}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black"
                >
                  Back to Assignments
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-lg font-bold">{assessment_details.title}</h1>
              <div className="mb-4 text-gray-600">
                Deadline:{" "}
                {new Date(assessment_details.deadline).toLocaleDateString()}
              </div>
              <h2 className="text-xl font-bold mb-4">
                {questions[currentQuestionIndex]}
              </h2>
              <div className="flex flex-col space-y-3 mb-4">
                {Object.entries(
                  assessment_details.question[questions[currentQuestionIndex]]
                ).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() =>
                      handleAnswer(questions[currentQuestionIndex], key)
                    }
                    className={`px-4 py-2 rounded-lg ${
                      selectedAnswers[questions[currentQuestionIndex]] === key
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>

              {/* Question Navigation */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Jump to a Question:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => jumpToQuestion(index)}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        selectedAnswers[question]
                          ? "bg-gray-500 text-white"
                          : index === currentQuestionIndex
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="w-full px-4 py-2 bg-gray-600 text-white text-lg rounded-lg hover:bg-gray-700"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h3 className="text-xl font-bold mb-4">
                  Are you sure you want to submit?
                </h3>
                <p className="text-gray-700 mb-6">
                  Once you submit, you cannot change your answers.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
