import React from "react";
import ProfilePage from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | CapBridge",
  description: "Form Penerbit",
};

export default function page() {

  return <ProfilePage/>;
}
