import axios from "axios";
import { Institute, InstituteResponse } from "@/types/institute";
import { apiUrl } from "@/lib/env";
import { getToken } from "@/lib/getToken";

const token = getToken();

export const addInstitute = async (
  name: string
): Promise<InstituteResponse> => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/institutes`,
      { name }, // Wrap in an object to send as JSON
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Explicitly set JSON content type
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding institute:", error);
    throw error;
  }
};
