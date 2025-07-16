"use client";

import React, { useEffect, useState, Fragment } from "react";

const FormPemodal: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const steps = [
    <div key="1">
      <h2 className="text-xl font-bold mb-4">Informasi Pribadi</h2>
      <input type="text" placeholder="Nama" className="border p-2 w-full" />
    </div>,
    <div key="2">
      <h2 className="text-xl font-bold mb-4">Step 2: Diproses</h2>
      <input type="email" placeholder="Email" className="border p-2 w-full" />
    </div>,
    <div key="3">
      <h2 className="text-xl font-bold mb-4">Step 3: Dikirim</h2>
      <input type="text" placeholder="Alamat" className="border p-2 w-full" />
    </div>,
    <div key="4">
      <h2 className="text-xl font-bold mb-4">Step 4: Tiba di Tujuan</h2>
      <input type="text" placeholder="Kota" className="border p-2 w-full" />
    </div>,
    <div key="5">
      <h2 className="text-xl font-bold mb-4">Step 5: Selesai</h2>
      <p>Terima kasih!</p>
    </div>,
  ];

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    alamat: "",
    kota: "",
  });

  // Ambil data dari localStorage saat pertama render
  useEffect(() => {
    const savedData = localStorage.getItem("formPemodal");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    // Simpan data ke localStorage
    localStorage.setItem("formPemodal", JSON.stringify(formData));
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
      {/* {steps[selectedIndex]} */}

      {/* Step content */}
      {selectedIndex === 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Informasi Pribadi</h2>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama"
            className="border p-2 w-full"
          />
        </div>
      )}

      {selectedIndex === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 2: Email</h2>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full"
          />
        </div>
      )}

      {selectedIndex === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 3: Alamat</h2>
          <input
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Alamat"
            className="border p-2 w-full"
          />
        </div>
      )}

      {selectedIndex === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Step 4: Kota</h2>
          <input
            type="text"
            name="kota"
            value={formData.kota}
            onChange={handleChange}
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

      <div className="flex justify-between mt-10">
        <button
          onClick={() => setSelectedIndex((prev) => prev - 1)}
          disabled={selectedIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Kembali
        </button>

        {selectedIndex < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Selanjutnya
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("formPemodal");
              alert("Form telah selesai dan data dihapus dari localStorage.");
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
