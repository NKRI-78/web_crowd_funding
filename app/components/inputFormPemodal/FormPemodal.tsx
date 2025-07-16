"use client";

import React, { useEffect, useState } from "react";
import DataBank from "./informasiBank/DataBank"; // Pastikan path benar

const FormPemodal: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isFormBankValid = () => {
    return (
      (formBank.namaBank || "").trim() !== "" &&
      (formBank.nomorRekening || "").trim() !== "" &&
      (formBank.namaPemilik || "").trim() !== "" &&
      (formBank.cabangBank || "").trim() !== ""
    );
  };

  const [formBank, setFormBank] = useState({
    namaBank: "",
    nomorRekening: "",
    namaPemilik: "",
    cabangBank: "",
  });

  const [formDataPribadi, setFormDataPribadi] = useState({
    nama: "",
    email: "",
    alamat: "",
    kota: "",
  });

  // Ambil data dari localStorage saat pertama kali render
  useEffect(() => {
    const savedPribadi = localStorage.getItem("formPribadi");
    const savedBank = localStorage.getItem("formBank");

    if (savedPribadi) setFormDataPribadi(JSON.parse(savedPribadi));
    if (savedBank) setFormBank(JSON.parse(savedBank));
  }, []);

  // Handler untuk data pribadi
  const handleChangePribadi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataPribadi((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk data bank
  const handleChangeBank = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormBank((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    // Simpan ke localStorage
    localStorage.setItem("formPribadi", JSON.stringify(formDataPribadi));
    localStorage.setItem("formBank", JSON.stringify(formBank));
    setSelectedIndex((prev) => prev + 1);
  };

  return (
    <div className="px-6 md:px-20 py-24 max-w-3xl mx-auto text-black">
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
          <h2 className="text-xl font-bold mb-4">Informasi Pribadi</h2>
          <input
            type="text"
            name="nama"
            value={formDataPribadi.nama}
            onChange={handleChangePribadi}
            placeholder="Nama"
            className="border p-2 w-full mb-4"
          />
          <input
            type="email"
            name="email"
            value={formDataPribadi.email}
            onChange={handleChangePribadi}
            placeholder="Email"
            className="border p-2 w-full"
          />
        </div>
      )}

      {selectedIndex === 1 && (
        <DataBank data={formBank} onChange={handleChangeBank} />
      )}

      {selectedIndex === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Alamat Lengkap</h2>
          <input
            type="text"
            name="alamat"
            value={formDataPribadi.alamat}
            onChange={handleChangePribadi}
            placeholder="Alamat"
            className="border p-2 w-full"
          />
        </div>
      )}

      {selectedIndex === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Kota Domisili</h2>
          <input
            type="text"
            name="kota"
            value={formDataPribadi.kota}
            onChange={handleChangePribadi}
            placeholder="Kota"
            className="border p-2 w-full"
          />
        </div>
      )}

      {selectedIndex === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Selesai</h2>
          <p>Data berhasil disimpan. Terima kasih!</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
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
            disabled={selectedIndex === 1 && !isFormBankValid()}
            className={`px-4 py-2 rounded text-white ${
              selectedIndex === 1 && !isFormBankValid()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600"
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
