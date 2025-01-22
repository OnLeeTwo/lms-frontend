'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export interface EssayAssessmentDetail {
  title: string;
  assessment_id: number;
  questions: EssayQuestion[];
}

export interface EssayQuestion {
  question: string;
}

const essayQuestions: EssayAssessmentDetail[] = [
  {
    title: '# Essay Assessment 1: Web Development Trends',
    assessment_id: 1,
    questions: [
      { question: 'Discuss the evolution of front-end development frameworks over the last decade.' },
      { question: 'How do modern web applications handle user authentication and security?' },
      { question: 'What is the role of Progressive Web Apps (PWAs) in the future of mobile web development?' },
    ],
  },
  {
    title: '# Essay Assessment 2: Advanced Web Technologies',
    assessment_id: 3,
    questions: [
      { question: 'Explain the differences between server-side rendering and client-side rendering in web development.' },
      { question: 'Discuss the importance of web accessibility and how developers can implement accessible designs.' },
      { question: 'What is the significance of API-driven development in the context of modern web applications?' },
    ],
  },
  {
    title: '# Essay Assessment 3: User Experience Design',
    assessment_id: 5,
    questions: [
      { question: 'Explain the importance of responsive design and how it affects user experience.' },
      { question: 'Describe the concept of accessibility and how it relates to user experience.' },
      { question: 'How can developers create visually appealing and user-friendly interfaces for web applications?' },
    ]
  }
];


export default function EssayQuiz({ assessment_id }: { assessment_id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get('assessment_id');

  const assessment = essayQuestions.find(
    (quiz) => quiz.assessment_id === Number(assessment_id)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    assessment ? Array(assessment.questions.length).fill('') : []
  );
  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Assessment Not Found</h1>
          <p className="text-gray-600 mt-4">
            The requested assessment could not be found. Please check the URL or return to the
            assignments page.
          </p>
          <button
            onClick={() => router.push('/moduleDetail')}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = assessment.questions.length;

  const handleAnswerChange = (value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    setShowConfirmation(false);
    setShowSummary(true);
  
    const essayResults = {
      assessment_id: assessment_id,
      questions: assessment.questions.map((question, index) => ({
        question: question.question,
        answer: answers[index] || 'No answer provided.',
      })),
    };
  
    localStorage.setItem(assessment_id.toString(), JSON.stringify(essayResults));
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
              {assessment.questions.map((q, index) => (
                <div key={index}>
                  <p className="font-semibold">{q.question}</p>
                  <p className="mt-1">{answers[index] || 'No answer provided.'}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/moduleDetail')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Assignments
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <h2 className="text-lg mb-4">
              {assessment.questions[currentQuestionIndex].question}
            </h2>
            <textarea
              className="w-full h-40 p-3 border rounded-lg mb-4"
              placeholder="Write your answer here..."
              value={answers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
            ></textarea>

            {/* Question Navigation */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Jump to a Question:</h3>
              <div className="flex flex-wrap gap-2">
                {assessment.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => jumpToQuestion(index)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      answers[index] !== ''
                        ? 'bg-gray-500 text-white'
                        : index === currentQuestionIndex
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
              <h3 className="text-xl font-bold mb-4">Are you sure you want to submit?</h3>
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
