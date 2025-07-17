import React from "react";

import type { Metadata } from "next";

import FormPenerbit from "@/app/components/inputFormPenerbit/FormPenerbit";
import FormPemodal from "@/app/components/inputFormPemodal/FormPemodal";
import JabatanForm from "./FormPenerbitModal";

export const metadata: Metadata = {
  title: "Form Penerbit | CapBridge",
  description: "Form Penerbit",
};

const FormPenerbitPage: React.FC = () => {
  return <FormPenerbit />;
};

export default FormPenerbitPage;

