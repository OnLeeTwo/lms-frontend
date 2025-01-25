"use client";
import axios from "axios";
import {
  Course,
  CourseResponse,
  CourseResponseDetail,
  CourseMessage,
} from "@/types/course";
import { apiUrl } from "@/lib/env";
import { getToken } from "@/lib/getToken";

const token = getToken();

export const getCourse = async (): Promise<CourseResponse> => {
  try {
    const token = getToken();
    const response = await axios.get(`${apiUrl}/api/v1/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }
};

export const getCourseById = async (
  courseId: string
): Promise<CourseResponseDetail> => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching module:", error);
    throw error;
  }
};

export const updateCourse = async (
  course: Partial<Course>,
  courseId: string
): Promise<CourseResponseDetail> => {
  try {
    const response = await axios.patch(
      `${apiUrl}/api/v1/courses/${courseId}`,
      course,
      {
        headers: {
          "Content-Type": "application/json",
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

export const deleteCourse = async (
  courseId: string
): Promise<CourseMessage> => {
  try {
    const response = await axios.delete(
      `${apiUrl}/api/v1/courses/${courseId}`,
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

export const addCourse = async (
  course: Partial<Course>
): Promise<CourseResponseDetail> => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/courses`, course, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};
