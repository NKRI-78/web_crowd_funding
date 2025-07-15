import React from "react";

import type { Metadata } from "next";

import Register from "@components/auth/register/Register";

export const metadata: Metadata = {
  title: "Daftar | CapBridge",
  description: "CapBridge",
};

const RegisterPage: React.FC = () => {
  return (
    <Register />
  );
};

export default RegisterPage;
