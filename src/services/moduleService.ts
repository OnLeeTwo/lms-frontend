import axios from "axios";
import { Module } from "@/types/module";

const API_URL = "API_URL";

export const getModulesByCourseId = async (): Promise<Module[]> => {
  try {
    const response = await axios.get(`${API_URL}/courses/${courseId}/modules`);
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }
};

export const getModuleById = async (moduleId: string): Promise<Module> => {
  try {
    const response = await axios.get(`${API_URL}/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching module:", error);
    throw error;
  }
};
