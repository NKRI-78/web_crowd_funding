import React from "react";

import type { Metadata } from "next";
import AboutUs from "../components/aboutus/AboutUs";

export const metadata: Metadata = {
  title: "Tentang | CapBridge",
  description: "Tentang",
};

const AboutUsPage: React.FC = () => {
  return (
    <AboutUs/>
  );
};

export default AboutUsPage;
