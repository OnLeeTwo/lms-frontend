'use client';

import React from 'react';
import EssayQuiz from '@/components/Essay';
import MultipleChoiceQuiz from '@/components/MultipleChoices';
import { useSearchParams } from 'next/navigation';

export default function AssessmentDetailsPage({ params }: { params: Promise<{ assessment_id: string }> }) {
  const [unwrappedParams, setUnwrappedParams] = React.useState<{ assessment_id: string } | null>(null);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  React.useEffect(() => {
    params.then((resolvedParams) => setUnwrappedParams(resolvedParams));
  }, [params]);

  if (!unwrappedParams) {
    return <p>Loading...</p>;
  }

  const { assessment_id } = unwrappedParams;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assessment Details</h1>
      {type === 'Choices' && <MultipleChoiceQuiz assessment_id={assessment_id} />}
      {type === 'Essay' && <EssayQuiz assessment_id={assessment_id} />}
      {!type && <p>Invalid assessment type.</p>}
    </div>
  );
}
