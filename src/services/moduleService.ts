import axios from "axios";
import { Module, ModuleResponse } from "@/types/module";
import { apiUrl } from "@/lib/env";
import { getToken } from "@/lib/getToken";

const token = getToken();

export const getModulesByCourseId = async (
  courseId: string
): Promise<ModuleResponse> => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${apiUrl}/api/v1/courses/${courseId}/modules`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }
};

export const getModuleById = async (
  moduleId: string,
  courseId: string
): Promise<Module> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/courses/${courseId}/modules/${moduleId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching module:", error);
    throw error;
  }
};

export const updateModule = async (
  module: Partial<Module>,
  courseId: string,
  moduleId: string
): Promise<Module> => {
  try {
    const response = await axios.patch(
      `${apiUrl}/api/v1/courses/${courseId}/modules/${moduleId}`,
      module,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
};

export const deleteModule = async (
  courseId: string,
  moduleId: string
): Promise<Module> => {
  try {
    const response = await axios.delete(
      `${apiUrl}/api/v1/courses/${courseId}/modules/${moduleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting module:", error);
    throw error;
  }
};

export const addModule = async (
  module: Partial<Module>,
  courseId: string
): Promise<Module> => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/courses/${courseId}/modules`,
      module,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
};
