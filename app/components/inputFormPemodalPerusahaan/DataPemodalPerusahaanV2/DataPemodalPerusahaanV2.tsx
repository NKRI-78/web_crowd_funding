"use client";

import React, { useState } from "react";

interface DataPemodalPerusahaanV2Props {
  formData: any;
  onBack: () => void;
  onSubmit: () => void;
}

const Step2: React.FC<DataPemodalPerusahaanV2Props> = ({
  formData,
  onBack,
  onSubmit,
}) => {
  const [localData, setLocalData] = useState({
    nomorNpwp: formData.nomorNpwp,
    alamat: formData.alamat,
    provinsi: formData.provinsi,
    kota: formData.kota,
    kecamatan: formData.kecamatan,
    noTelp: formData.noTelp,
    situs: formData.situs,
    email: formData.email,
    nomorRekening: formData.nomorRekening,
    namaRekening: formData.namaRekening,
    namaBank: formData.namaBank,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="mb-4">
        <label>Nomor NPWP Perusahaan</label>
        <input
          type="text"
          name="nomorNpwp"
          value={localData.nomorNpwp}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Alamat</label>
        <input
          type="text"
          name="alamat"
          value={localData.alamat}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      {/* TODO: Dropdown dinamis Provinsi → Kota → Kecamatan */}

      <div className="mb-4">
        <label>No Telp Perusahaan</label>
        <input
          type="text"
          name="noTelp"
          value={localData.noTelp}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Situs Perusahaan</label>
        <input
          type="text"
          name="situs"
          value={localData.situs}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Email Perusahaan</label>
        <input
          type="email"
          name="email"
          value={localData.email}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Nomor Rekening Perusahaan</label>
        <input
          type="text"
          name="nomorRekening"
          value={localData.nomorRekening}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Nama Rekening Perusahaan</label>
        <input
          type="text"
          name="namaRekening"
          value={localData.namaRekening}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label>Nama Bank</label>
        <input
          type="text"
          name="namaBank"
          value={localData.namaBank}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default Step2;
