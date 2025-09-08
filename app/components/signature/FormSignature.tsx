"use client";

import React, { useState } from "react";
import ContainerSignature from "./component/ContainerSignature";
import DocumentPreview from "./component/DocumentPreview";

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
    // TODO: Kirim ke backend
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Form Tanda Tangan</h2>

      <DocumentPreview fileId="1k0hbt_DAQfAMArfc1Yl-hI8Q-aGiRU5d" />

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
