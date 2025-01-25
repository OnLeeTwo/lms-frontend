export interface Assessment {
  id: string;
  module_id: number;
  type: "essay" | "choices";
  created_at: string;
  updated_at: string;
}

export interface AssessmentDetails {
  assessment_id: number;
  title: string;
  question: Record<string, Record<string, string>> | Record<string, string>; // choices or essay questions
  answer: Record<string, string> | null; //null for essay
  deadline: string;
  created_at: string;
  updated_at: string;
  message: string;
}
