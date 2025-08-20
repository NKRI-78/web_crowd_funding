"use client";

import React, { useEffect, useState } from "react";
import DataPemodalPerusahaanV1 from "./DataPemodalPerusahaanV1/DataPemodalPerusahaanV1";
import DataPemodalPerusahaanV2 from "./DataPemodalPerusahaanV2/DataPemodalPerusahaanV2";
import { no } from "zod/v4/locales";

const FormDataPemodalPerusahaan: React.FC = () => {
  type OptionType = { value: string; label: string } | null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodal");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          jenisPerusahaan: parsed.jenisPerusahaan || "",
          nomorAktaPerubahanTerakhir: parsed.nomorAktaPerubahanTerakhir || "",
          nomorNpwpPerusahaan: parsed.nomorNpwpPerusahaan || "",
          alamatTempatUsaha: parsed.alamatTempatUsaha || "",
          noTeleponPerusahaan: parsed.noTeleponPerusahaan || "",
          situsPerusahaan: parsed.situsPerusahaan || "",
          emailPerusahaan: parsed.emailPerusahaan || "",
          namaBank: parsed.namaBank ?? null,
          nomorRekening: parsed.nomorRekening || "",
          namaPemilik: parsed.namaPemilik || "",

          aktaPendirianPerusahaanUrl: parsed.aktaPendirianPerusahaanUrl || "",
          skPendirianUrl: parsed.skPendirianUrl || "",
          skKumhamPerusahaanUrl: parsed.skKumhamPerusahaanUrl || "",
          npwpPerusahaanUrl: parsed.npwpPerusahaanUrl || "",

          provincePemodalPerusahaan: parsed.provincePemodalPerusahaan ?? null,
          cityPemodalPerusahaan: parsed.cityPemodalPerusahaan ?? null,
          districtPemodalPerusahaan: parsed.districtPemodalPerusahaan ?? null,
          subDistrictPemodalPerusahaan:
            parsed.subDistrictPemodalPerusahaan ?? null,

          posCode: parsed.posCode || "",
          addres: parsed.addres || "",
        };
      }
    }
    return {
      jenisPerusahaan: "",
      nomorAktaPerubahanTerakhir: "",
      nomorNpwpPerusahaan: "",
      alamatTempatUsaha: "",
      noTeleponPerusahaan: "",
      situsPerusahaan: "",
      emailPerusahaan: "",
      namaBank: "",
      nomorRekening: "",
      namaPemilik: "",

      aktaPendirianPerusahaanUrl: "",
      skPendirianUrl: "",
      skKumhamPerusahaanUrl: "",
      npwpPerusahaanUrl: "",

      provincePemodalPerusahaan: "",
      cityPemodalPerusahaan: "",
      districtPemodalPerusahaan: "",
      subDistrictPemodalPerusahaan: "",

      posCode: "",
      addres: "",
    };
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBank = (namaBank: OptionType) => {
    setFormData((prev) => ({
      ...prev,
      namaBank: namaBank as NonNullable<OptionType>,
    }));
  };

  // Ambil data dari localStorage saat mount
  useEffect(() => {
    const savedForm = localStorage.getItem("formPemodalPerusahaan");
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      setFormData({
        jenisPerusahaan: parsed.jenisPerusahaan || "",
        nomorAktaPerubahanTerakhir: parsed.nomorAktaPerubahanTerakhir || "",
        nomorNpwpPerusahaan: parsed.nomorNpwpPerusahaan || "",
        alamatTempatUsaha: parsed.alamatTempatUsaha || "",
        noTeleponPerusahaan: parsed.noTeleponPerusahaan || "",
        situsPerusahaan: parsed.situsPerusahaan || "",
        emailPerusahaan: parsed.emailPerusahaan || "",
        namaBank: parsed.namaBank || "",
        nomorRekening: parsed.nomorRekening || "",
        namaPemilik: parsed.namaPemilik || "",

        aktaPendirianPerusahaanUrl: parsed.aktaPendirianPerusahaanUrl || "",
        skPendirianUrl: parsed.skPendirianUrl || "",
        skKumhamPerusahaanUrl: parsed.skKumhamPerusahaanUrl || "",
        npwpPerusahaanUrl: parsed.npwpPerusahaanUrl || "",

        provincePemodalPerusahaan: parsed.provincePemodalPerusahaan || "",
        cityPemodalPerusahaan: parsed.cityPemodalPerusahaan || "",
        districtPemodalPerusahaan: parsed.districtPemodalPerusahaan || "",
        subDistrictPemodalPerusahaan: parsed.subDistrictPemodalPerusahaan || "",

        posCode: parsed.posCode || "",
        addres: parsed.addres || "",
      });
    }
  }, []);

  // Simpan ke localStorage setiap kali formData berubah
  useEffect(() => {
    const fullData = {
      ...formData,
    };

    localStorage.setItem("formPemodalPerusahaan", JSON.stringify(fullData));
  }, [formData]);

  const handleAlamatChange = (alamat: {
    provincePemodalPerusahaan: OptionType;
    cityPemodalPerusahaan: OptionType;
    districtPemodalPerusahaan: OptionType;
    subDistrictPemodalPerusahaan: OptionType;
    posCode: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      provincePemodalPerusahaan: alamat.provincePemodalPerusahaan,
      cityPemodalPerusahaan: alamat.cityPemodalPerusahaan,
      districtPemodalPerusahaan: alamat.districtPemodalPerusahaan,
      subDistrictPemodalPerusahaan: alamat.subDistrictPemodalPerusahaan,
      posCode: alamat.posCode,
    }));
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
          onBankChange={handleBank}
          onAlamatChange={handleAlamatChange}
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
