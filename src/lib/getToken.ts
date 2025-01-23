// Ambil token dari localStorage
export const getToken = () => {
  const userData = localStorage.getItem("userData"); // Ambil data dari localStorage
  if (!userData) {
    throw new Error("User data not found in localStorage. Please log in.");
  }

  try {
    const parsedData = JSON.parse(userData); // Parse JSON string menjadi objek
    const token = parsedData.token; // Akses properti token
    if (!token) {
      throw new Error("Token not found in user data.");
    }
    return token;
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    throw new Error("Invalid user data format in localStorage.");
  }
};

export default getToken;
