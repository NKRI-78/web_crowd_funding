"use server";

import { API_BACKEND } from "@/app/utils/constant";

export interface InboxResponse {
  id: number;
  type: string;
  status: string;
  // tambahkan field lain sesuai API kamu
}

export async function fetchInboxAction(
  token: string
): Promise<InboxResponse[]> {
  try {
    if (!token) return [];
    console.log("Fetch Inbox");

    const res = await fetch(`${API_BACKEND}/api/v1/inbox/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Gagal fetch inbox", res.statusText);
      return [];
    }

    const data = await res.json();

    if (!data?.data) return [];

    const filteredInboxes = (data.data as InboxResponse[])
      .filter(
        (inbox) => inbox.type === "billing" && inbox.status !== "REJECTED"
      )
      .reverse();

    return filteredInboxes;
  } catch (error) {
    console.error("Error fetch inbox:", error);
    return [];
  }
}
