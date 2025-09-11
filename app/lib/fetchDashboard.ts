// app/lib/fetchDashboard.ts
import axios from "axios";
import { DashboardResponse } from "../interfaces/dashboard/dashboard";

export async function fetchDashboard(
  token: string
): Promise<DashboardResponse["data"]> {
  const res = await axios.get<DashboardResponse>(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/dashboard/investor`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
}
