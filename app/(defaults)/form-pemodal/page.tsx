import React from "react";

import type { Metadata } from "next";
import FormPemodal from "@/app/components/inputFormPemodal/FormPemodal";

export const metadata: Metadata = {
  title: "Form Pemodal | CapBridge",
  description: "Form Pemodal",
};

const FormPemodalPage: React.FC = () => {
  return <FormPemodal />;
};

export default FormPemodalPage;
