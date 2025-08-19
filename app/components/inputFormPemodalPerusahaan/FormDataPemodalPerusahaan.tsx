"use client";

import React, { useState } from "react";
import DataPemodalPerusahaanV1 from "./DataPemodalPerusahaanV1/DataPemodalPerusahaanV1";
import DataPemodalPerusahaanV2 from "./DataPemodalPerusahaanV2/DataPemodalPerusahaanV2";
import { no } from "zod/v4/locales";

const FormDataPemodalPerusahaan: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jenisPerusahaan: "",
    nomorAktaPerubahanTerakhir: "",
    nomorNpwpPerusahaan: "",
    alamatTempatUsaha: "",
    noTeleponPerusahaan: "",

    aktaPendirianPerusahaanUrl: "",
    skPendirianUrl: "",
    skKumhamPerusahaanUrl: "",
    npwpPerusahaanUrl: "",

    provincePemodalPerusahaan: { value: "", label: "" },
    cityPemodalPerusahaan: { value: "", label: "" },
    districtPemodalPerusahaan: { value: "", label: "" },
    subDistrictPemodalPerusahaan: { value: "", label: "" },

    posCode: "",
    addres: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full py-10 px-6 md:px-20 lg:px-40 bg-white">
      <h1 className="text-2xl font-bold mb-6">Form Pemodal Perusahaan V2</h1>
      {step === 1 && (
        <DataPemodalPerusahaanV1
          formData={formData}
          onChange={handleChange}
          onUploadAktaPendirianPerusahaan={(url, key) => {
            setFormData((prev) => ({ ...prev, [key]: url }));
          }}
          onUploadSkPendirian={(url, key) => {
            setFormData((prev) => ({ ...prev, [key]: url }));
          }}
          onUploadSkKumhamPerusahaan={(url, key) => {
            setFormData((prev) => ({ ...prev, [key]: url }));
          }}
          onUploadNpwpPerusahaan={(url, key) => {
            setFormData((prev) => ({ ...prev, [key]: url }));
          }}
        />
      )}

      {step === 2 && (
        <DataPemodalPerusahaanV2
          formData={formData}
          onBack={function (): void {
            throw new Error("Function not implemented.");
          }}
          onSubmit={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default FormDataPemodalPerusahaan;
