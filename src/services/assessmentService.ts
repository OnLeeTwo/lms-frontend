// src/services/assessmentService.ts
import axios from "axios";
import { Assessment, AssessmentDetails } from "@/types/assessment";
import { apiUrl } from "@/lib/env";
import { getToken } from "@/lib/getToken";

const token = getToken();

export const getAssessmentsByModuleId = async (
  moduleId: string
): Promise<Assessment[]> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/assessments/module/${moduleId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

export const getAssessmentsDetails = async (
  assessmentId: string
): Promise<AssessmentDetails> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/assessments_details/${assessmentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};
