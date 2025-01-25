"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AssessmentDetails } from "@/types/assessment";

export default function EssayQuiz({
  assessment,
}: {
  assessment: AssessmentDetails | null;
}) {
  const router = useRouter();

  // Move hook calls before any conditional rendering
  const questions = useMemo(
    () =>
      assessment && typeof assessment.question === "object"
        ? Object.values(assessment.question)
        : [],
    [assessment]
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    questions.map(
      () => assessment?.answer?.[`question${currentQuestionIndex + 1}`] || ""
    )
  );
  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Early return if no assessment
  if (!assessment) {
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

  // Early return if no questions
  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No Questions Found</h1>
          <p className="text-gray-600 mt-4">
            The assessment does not contain any questions.
          </p>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    setShowConfirmation(false);
    setShowSummary(true);

    const essayResults = {
      assessment_id: assessment.assessment_id,
      questions: questions.map((question, index) => ({
        question,
        answer: answers[index] || "No answer provided.",
      })),
    };

    localStorage.setItem(
      assessment.assessment_id.toString(),
      JSON.stringify(essayResults)
    );
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full bg-gray-100 rounded-lg shadow-lg p-6">
        {showSummary ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Submission Summary</h2>
            <div className="text-left mt-4 space-y-4">
              {questions.map((q, index) => (
                <div key={index}>
                  <p className="font-semibold">{q}</p>
                  <p className="mt-1">
                    {answers[index] || "No answer provided."}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Assignments
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <div className="mb-4 text-gray-600">
              Deadline: {new Date(assessment.deadline).toLocaleDateString()}
            </div>
            <h2 className="text-lg mb-4">{questions[currentQuestionIndex]}</h2>
            <textarea
              className="w-full h-40 p-3 border rounded-lg mb-4"
              placeholder="Write your answer here..."
              value={answers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
            ></textarea>
            {/* Question Navigation */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Jump to a Question:
              </h3>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => jumpToQuestion(index)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      answers[index] !== ""
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
                Submit Answers
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
    </div>
  );
}
