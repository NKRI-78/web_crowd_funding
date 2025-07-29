import React from "react";
import { Metadata } from "next";
import ProfilePage from "../auth/profile/page";

export const metadata: Metadata = {
  title: "Profile | CapBridge",
  description: "Form Penerbit",
};

export default function page() {
  return <ProfilePage />;
}
