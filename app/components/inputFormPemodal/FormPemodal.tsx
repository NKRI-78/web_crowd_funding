"use client";

import React, { useEffect, useState } from "react";
import DataBank from "./informasiBank/DataBank"; // Pastikan path benar
import ComponentDataPribadi from "./informasiPribadi/DataPribadi";

const FormPemodal: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  //   const isFormBankValid = () => {
  //     return (
  //       (formBank.namaBank || "").trim() !== "" &&
  //       (formBank.nomorRekening || "").trim() !== "" &&
  //       (formBank.namaPemilik || "").trim() !== "" &&
  //       (formBank.cabangBank || "").trim() !== ""
  //     );
  //   };

  //   const [formBank, setFormBank] = useState({
  //     namaBank: "",
  //     nomorRekening: "",
  //     namaPemilik: "",
  //     cabangBank: "",
  //   });

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

  // Ambil data dari localStorage saat pertama kali render
  //   useEffect(() => {
  //     // const savedPribadi = localStorage.getItem("formPribadi");
  //     const savedBank = localStorage.getItem("formBank");

  //     // if (savedPribadi) setFormDataPribadi(JSON.parse(savedPribadi));
  //     if (savedBank) setFormBank(JSON.parse(savedBank));
  //   }, []);

  // Handler untuk data bank
  //   const handleChangeBank = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setFormBank((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

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

  const handleNext = () => {
    const fullData = {
      ...dataPribadi,
      //   ...formBank,
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
          <h2 className="text-xl font-bold mb-4">Selesai</h2>
          <p>Data berhasil disimpan. Terima kasih!</p>
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

        {selectedIndex < 4 ? (
          <button
            onClick={handleNext}
            // disabled={selectedIndex === 1 && !isFormBankValid()}
            disabled={selectedIndex === 1}
            // className={`px-4 py-2 rounded text-white ${
            //   selectedIndex === 1 && !isFormBankValid()
            //     ? "bg-gray-400 cursor-not-allowed"
            //     : "bg-[#4821C2]"
            // }`}
            className={`px-4 py-2 rounded text-white ${
              selectedIndex === 1
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
