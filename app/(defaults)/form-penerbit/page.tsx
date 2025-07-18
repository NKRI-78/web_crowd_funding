import React from "react";
import ParentPage from "./ParentPage";

import type { Metadata } from "next";

import FormPenerbit from "@/app/components/inputFormPenerbit/FormPenerbit";
import FormPemodal from "@/app/components/inputFormPemodal/FormPemodal";
import JabatanForm from "./FormPenerbitModal";
import PublisherForm from "./FormPenerbit";
import MultiStepForm from "./PenerbitParent";

export const metadata: Metadata = {
  title: "Form Penerbit | CapBridge",
  description: "Form Penerbit",
};

const FormPenerbitPage: React.FC = () => {
  return <MultiStepForm />;
};

export default FormPenerbitPage;
