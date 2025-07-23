"use client";
import { IProject } from "@app/interface/IProject";
import { BASE_URL } from "@app/utils/constant";
import axios from "axios";

export async function getAllProject() {
  try {
    const apiUrl = `${BASE_URL}/api/v1/project/list`;
    const response = await axios(apiUrl);
    const data: IProject = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
