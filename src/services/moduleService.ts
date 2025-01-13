import axios from "axios";
import { Module } from "@/types/module";

const API_URL = "API_URL";

export const getModulesByCourseId = async (
  courseId: string
): Promise<Module[]> => {
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

export const updateModule = async (
  module: Partial<Module>
): Promise<Module> => {
  try {
    const response = await axios.patch(
      `${API_URL}/modules/${module.module_id}`,
      module
    );
    return response.data;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
};
