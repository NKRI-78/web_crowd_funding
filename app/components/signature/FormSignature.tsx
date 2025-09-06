"use client";

import React, { useState } from "react";
import ContainerSignature from "./component/ContainerSignature";

interface FormData {
  signature: string;
}

const FormSignature: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ signature: "" });

  const handleSignatureSave = (signatureUrl: string) => {
    setFormData((prev) => ({ ...prev, signature: signatureUrl }));
  };

  const handleSubmit = () => {
    if (!formData.signature) {
      alert("Tanda tangan wajib diisi!");
      return;
    }

    console.log("Form submitted:", formData);
    // TODO: Kirim ke backend (axios/fetch) dengan formData.signature
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Form Tanda Tangan</h2>

      <ContainerSignature
        formData={formData}
        onSignatureSave={handleSignatureSave}
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
};

export default FormSignature;
