export interface Submission {
  submission_id: number;
  assessment_id: number;
  role_id: number;
  score?: number | null;
  answer?: Record<string, any> | null;
  file?: string | null;
  submitted_at: string;
  updated_at: string;
  user_name: string;
  assessment_type: "essay" | "choices";
  assessment_title: string;
  question: string;
}