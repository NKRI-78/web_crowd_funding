import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";

export async function fetchDetailProject(projectId: string) {
  const apiUrl = `${API_BACKEND}/api/v1/project/detail/${projectId}`;
  try {
    const response = await axios.get(apiUrl);
    const data = await response.data;
    return data["data"];
  } catch (error) {
    return null;
  }
}
