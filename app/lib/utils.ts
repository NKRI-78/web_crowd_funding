import Cookies from "js-cookie";
import DOMPurify from "dompurify";

import moment from "moment";

export const getUserId = (): string | undefined => {
  return Cookies.get("user_id");
};

export const getUserName = (): string | undefined => {
  return Cookies.get("username");
};

export const getUserEmail = (): string | undefined => {
  return Cookies.get("email");
};

export const getToken = (): string | undefined => {
  return Cookies.get("token");
};

export const handleDescriptionTruncate = (
  description: string,
  maxLength: number = 100
) => {
  return description.length > maxLength
    ? `${description.substring(0, maxLength)}...`
    : description;
};

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};

export const formatRupiah = (amount: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

export const formatInputRupiah = (value: string) => {
  const cleaned = value.replace(/[^\d]/g, ""); // remove anything not a digit
  if (!cleaned) return ""; // avoid NaN if empty
  const number = parseInt(cleaned, 10);
  return `Rp ${number.toLocaleString("id-ID")}`;
};

export const formatDate = (date: string | Date): string => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};
