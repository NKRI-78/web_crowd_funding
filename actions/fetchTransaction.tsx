"use server";

import { TransactionResponse } from "@/app/interfaces/transaction/transaction";

export async function getTransactions(
  token: string,
  page: number = 1,
  limit: number = 5
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/transaction/project/list?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // biar selalu fresh
    }
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil transaksi");
  }

  const data: TransactionResponse = await res.json();
  return data.data;
}
