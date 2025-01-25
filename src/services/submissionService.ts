// src/services/assessmentService.ts
import axios from "axios";
import { apiUrl } from "@/lib/env";
import { getToken } from "@/lib/getToken";
import {
  Submission,
  SubmissionResponse,
  SubmissionData,
} from "@/types/submission";

const token = getToken();

export const submitAssessment = async (
  assessmentId: string,
  submission: Partial<Submission>
): Promise<Partial<SubmissionResponse>> => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/assessments/${assessmentId}/submissions`,
      submission,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting assessments:", error);
    throw error;
  }
};

export const getMySubmission = async (): Promise<SubmissionData> => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/submissions/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching submission:", error);
    throw error;
  }
};

export const getMySubmissionbyAssessmentId = async (
  assessmentId: string
): Promise<SubmissionData> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/submissions/me/assessment/${assessmentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching submission:", error);
    throw error;
  }
};
