'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export interface AssessmentDetail {
  title: string;
  assessment_id: number;
  questions: subQuestion[];
}

export interface subQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
}

const quizQuestions: AssessmentDetail[] = [
  {
    title: '# Web Development Basics',
    assessment_id: 2,
    questions: [
      {
        question: 'What does HTML stand for?',
        answers: ['Hyper Text Markup Language', 'High Text Markup Language', 'Hyperlinks and Text Markup Language', 'None of the above'],
        correctAnswer: 0,
      },
      {
        question: 'Which of the following is used for styling web pages?',
        answers: ['HTML', 'CSS', 'JavaScript', 'PHP'],
        correctAnswer: 1,
      },
      {
        question: 'Which HTML tag is used to display images?',
        answers: ['<img>', '<image>', '<picture>', '<src>'],
        correctAnswer: 0,
      },
      {
        question: 'Which of these is a valid JavaScript variable declaration?',
        answers: ['var myVar;', 'let myVar;', 'const myVar;', 'All of the above'],
        correctAnswer: 3,
      },
      {
        question: 'What does CSS stand for?',
        answers: ['Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets', 'Computer Style Sheets'],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: '# Advanced Web Development',
    assessment_id: 4,
    questions: [
      {
        question: 'Which of these is a JavaScript framework?',
        answers: ['React', 'Angular', 'Vue', 'All of the above'],
        correctAnswer: 3,
      },
      {
        question: 'What does the term "DOM" stand for?',
        answers: ['Document Object Model', 'Data Object Model', 'Document Operation Model', 'None of the above'],
        correctAnswer: 0,
      },
      {
        question: 'Which of the following is used for backend development in JavaScript?',
        answers: ['Node.js', 'React', 'Vue.js', 'Angular'],
        correctAnswer: 0,
      },
      {
        question: 'Which tag is used to define an unordered list in HTML?',
        answers: ['<ul>', '<ol>', '<li>', '<list>'],
        correctAnswer: 0,
      },
      {
        question: 'Which of these is used for asynchronous programming in JavaScript?',
        answers: ['Promises', 'Callbacks', 'Async/Await', 'All of the above'],
        correctAnswer: 3,
      },
    ],
  },
];

export default function MultipleChoiceQuiz({ assessment_id }: { assessment_id: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get('assessment_id');
  console.log('Assessment ID from URL:', assessmentId);

  const assessment = quizQuestions.find(
    (quiz) => quiz.assessment_id === Number(assessment_id)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    assessment ? Array(assessment.questions.length).fill(-1) : []
  );
  const [showScore, setShowScore] = useState(false);
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

  const handleAnswer = (selectedOption: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = selectedOption;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    setShowConfirmation(false);
    setShowScore(true);

    const quizResults = {
      assessment_id: assessment_id,
      questions: assessment.questions.map((question, index) => ({
        question: question.question,
        answer: assessment.questions[index].answers[selectedAnswers[index]],
      })),
    };

    localStorage.setItem(assessment_id.toString(), JSON.stringify(quizResults));     
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === assessment.questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full bg-gray-100 rounded-lg shadow-lg p-6">
        {showScore ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Your Score</h2>
            <p className="text-lg">
              {calculateScore()} out of {totalQuestions}
            </p>
            <div className='flex justify-center gap-4'>
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers(Array(totalQuestions).fill(-1));
                  setShowScore(false);
                }}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black"
              >
                Restart Quiz
              </button>
              <button
              onClick={() => router.push('/moduleDetail')}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black"
              >
                Back to Assignments
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-lg font-bold">{assessment.title}</h1>
            <h2 className="text-xl font-bold mb-4">
              {assessment.questions[currentQuestionIndex].question}
            </h2>
            <div className="flex flex-col space-y-3 mb-4">
              {assessment.questions[currentQuestionIndex].answers.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Question Navigation */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Jump to a Question:</h3>
              <div className="flex flex-wrap gap-2">
                {assessment.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => jumpToQuestion(index)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      selectedAnswers[index] !== -1
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
                Submit Quiz
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
