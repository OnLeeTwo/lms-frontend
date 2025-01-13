// src/services/assessmentService.ts
import axios from "axios";
import { Assessment } from "@/types/assessment";

const API_URL = "http://127.0.0.1:5000/api/v1";

export const getAssessmentsByModuleId = async (
  moduleId: string
): Promise<Assessment[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/modules/${moduleId}/assessments`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};
