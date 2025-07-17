import React from "react";
import ParentPage from "./ParentPage";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Penerbit | CapBridge",
  description: "Form Penerbit",
};

const FormPenerbitPage: React.FC = () => {
  return <ParentPage />;
};

export default FormPenerbitPage;
