import axios from "axios";

const API_URL = "http://localhost:8082/waste/api/wastes";

export const getWastes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching wastes:", error);
    return [];
  }
};
