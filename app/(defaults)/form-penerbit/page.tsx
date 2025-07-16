import React from "react";

import type { Metadata } from "next";
import FormPemodal from "@/app/components/inputFormPemodal/FormPemodal";
import PublisherForm from "./FormPenerbit";

export const metadata: Metadata = {
  title: "Form Penerbit | CapBridge",
  description: "Form Penerbit",
};

const FormPemodalPage: React.FC = () => {
  return <PublisherForm />;
};

export default FormPemodalPage;