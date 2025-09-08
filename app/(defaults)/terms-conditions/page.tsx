import React from "react";

import type { Metadata } from "next";
import TermsConditions from "@/app/components/TermsConditions/TermsConditions";

export const metadata: Metadata = {
  title: "Terms And Conditions | FuLusme",
  description: "Terms And Conditions",
};

const TermsConditionsPage: React.FC = () => {
  return <TermsConditions />;
};

export default TermsConditionsPage;
