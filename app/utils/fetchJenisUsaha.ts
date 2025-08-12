import axios from "axios";
import { z } from "zod";
import { API_BACKEND } from "./constant";
import { getUser } from "../lib/auth";

export type TypeOption = { value: string; label: string };

export async function fetchJenisUsaha(): Promise<TypeOption[]> {
  const user = getUser();
  const { data } = await axios.get(`${API_BACKEND}/api/v1/business/list`, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  if (!data || !Array.isArray(data.data)) {
    throw new Error("Format respons API tidak sesuai");
  }

  return data.data.map((item: { id: number; name: string }) => ({
    value: item.name,
    label: item.name,
  }));
}
