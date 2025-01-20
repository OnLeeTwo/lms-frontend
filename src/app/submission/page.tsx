'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SubmissionPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('assessment_id');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (assessmentId) {
      const storedResults = localStorage.getItem(assessmentId);
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    }
  }, [assessmentId]);

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">No Results Found</h1>
        <p className="text-gray-600 mt-4">Please complete the assessment to view your submission.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Submission Results</h1>
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        {results.type === 'multiple-choice' ? (
          // Render for multiple-choice
          results.questions.map((q: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">{q.question}</h3>
              <p className="text-gray-700">
                Your Answer: <span className="font-semibold">{q.selectedOption}</span>
              </p>
              <p className="text-gray-700">
                Correct Answer: <span className="font-semibold">{q.correctOption}</span>
              </p>
            </div>
          ))
        ) : (
          // Render for essay
          results.questions.map((q: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">{q.question}</h3>
              <p className="text-gray-700">
                Your Answer: <span className="font-semibold">{q.answer}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
