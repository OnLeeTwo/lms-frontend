export type SubmissionResponse = {
  submission_id: number; // Primary key
  assessmentId: number; // Foreign key referencing assessments.id
  role_id: number; // Foreign key referencing roles.id
  score?: number | null; // Nullable score, could be undefined or null
  answer?: Record<string, any> | null; // Nullable JSON object for the answer
  file?: string | null; // Nullable file path, max length 255
  submitted_at: string; // Timestamp for submission
  user_name: string; // User name
  message: string; // Message for the submission
};

export type Submission = Omit<SubmissionResponse, "message">;

export type SubmissionData = {
  message: string; // Message describing the retrieval status
  submissions: Submission[]; // Array of submissions
};
