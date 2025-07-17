"use client";

import React, { useEffect, useState } from "react";
import DataBank from "./informasiBank/DataBank"; // Pastikan path benar
import ComponentDataPribadi from "./informasiPribadi/DataPribadi";
import ComponentDataPekerjaan from "./informasiPekerjaan/DataPekerjaan";

const FormPemodal: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [dataPribadi, setDataPribadi] = useState({
    nama: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    statusPernikahan: "",
    pendidikanTerakhir: "",
    addres: "",
    namaBank: "",
    nomorRekening: "",
    namaPemilik: "",
    cabangBank: "",
  });

  const [dataPekerjaan, setDataPekerjaan] = useState({
    namaPerusahaan: "",
    jabatan: "",
    alamatPerusahaan: "",
    penghasilanBulanan: "",
    tujuanInvestasi: "",
    tujuanInvestasiLainnya: "",
    toleransiResiko: "",
    pengalamanInvestasi: "",
    pengetahuanPasarModal: "",
    setujuKebenaranData: false,
    setujuRisikoInvestasi: false,
    signature: "",
  });

  const handleChangeDataPribadi = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDataPribadi((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (gender: string) => {
    setDataPribadi((prev) => ({ ...prev, jenisKelamin: gender }));
  };

  const handleChangeDataPekerjaan = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setDataPekerjaan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePenghasilanBulananChange = (penghasilanBulanan: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      penghasilanBulanan: penghasilanBulanan,
    }));
  };

  const handleToleransiResikoChange = (toleransiResiko: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      toleransiResiko: toleransiResiko,
    }));
  };

  const handlePengalamanInvestasi = (pengalamanInvestasi: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      pengalamanInvestasi: pengalamanInvestasi,
    }));
  };

  const handlePengetahuanPasarModal = (pengetahuanPasarModal: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      pengetahuanPasarModal: pengetahuanPasarModal,
    }));
  };

  const handleonTujuanInvetasiChange = (tujuanInvestasi: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      tujuanInvestasi: tujuanInvestasi,
      tujuanInvestasiLainnya: "",
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDataPekerjaan((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSignatureSave = (signature: string) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      signature,
    }));
  };

  const handleNext = () => {
    const fullData = {
      ...dataPribadi,
      ...dataPekerjaan,
    };

    localStorage.setItem("formPemodal", JSON.stringify(fullData));
    setSelectedIndex((prev) => prev + 1);
  };

  return (
    <div className="px-24 md:px-24 py-24 w-full mx-auto text-black">
      <div className="text-center mb-3">
        <h4 className="font-bold text-xl">Isi Data Sebagai Pemodal</h4>
        <span>
          Untuk memastikan kelancaran proses verifikasi dan layanan yang
          optimal, kami mengajak Anda untuk melengkapi seluruh data secara
          jujur, benar, dan akurat.
        </span>
      </div>

      {/* Step content */}
      {selectedIndex === 0 && (
        <div>
          <ComponentDataPribadi
            formData={dataPribadi}
            onChange={handleChangeDataPribadi}
            onGenderChange={handleGenderChange}
            // data={formBank}
            // onChangeBank={handleChangeBank}
          />
          {/* <DataBank data={formBank} onChange={handleChangeBank} /> */}
        </div>
      )}

      {selectedIndex === 1 && (
        <div>
          <ComponentDataPekerjaan
            formData={dataPekerjaan}
            onChange={handleChangeDataPekerjaan}
            onPenghasilanBulanan={handlePenghasilanBulananChange}
            onTujuanInvetasi={handleonTujuanInvetasiChange}
            onToleransiResiko={handleToleransiResikoChange}
            onPengalamanInvestasi={handlePengalamanInvestasi}
            onPengetahuanPasarModal={handlePengetahuanPasarModal}
            onCheckboxChange={handleCheckboxChange}
            onSignatureSave={handleSignatureSave}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-5 mt-10">
        <button
          onClick={() => setSelectedIndex((prev) => prev - 1)}
          disabled={selectedIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Kembali
        </button>

        {selectedIndex < 1 ? (
          <button
            onClick={handleNext}
            disabled={
              selectedIndex === 1 &&
              (!dataPekerjaan.setujuKebenaranData ||
                !dataPekerjaan.setujuRisikoInvestasi)
            }
            className={`px-4 py-2 rounded text-white ${
              selectedIndex === 1 &&
              (!dataPekerjaan.setujuKebenaranData ||
                !dataPekerjaan.setujuRisikoInvestasi)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4821C2]"
            }`}
          >
            Selanjutnya
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("formPribadi");
              localStorage.removeItem("formBank");
              alert("Form telah selesai dan data dihapus dari localStorage.");
              setSelectedIndex(0);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Selesai
          </button>
        )}
      </div>
    </div>
  );
};

export default FormPemodal;
