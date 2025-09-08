import React from "react";

import type { Metadata } from "next";
import AboutUs from "@/app/components/aboutus/AboutUs";

export const metadata: Metadata = {
  title: "Tentang | FuLusme",
  description: "Tentang",
};

const AboutUsPage: React.FC = () => {
  return <AboutUs />;
};

export default AboutUsPage;
