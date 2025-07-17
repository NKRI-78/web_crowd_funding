"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
    pekerjaan: "",
    pekerjaanLainnya: "",
    addres: "",
    namaBank: "",
    nomorRekening: "",
    namaPemilik: "",
    cabangBank: "",
    ktpUrl: "",
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

  const capitalizeWords = (value: string) => {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleChangeDataPribadi = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Hanya izinkan angka dan maksimal 16 digit untuk NIK
    if (name === "nik") {
      const numericValue = value.replace(/\D/g, ""); // hapus non-angka
      if (numericValue.length > 16) return; // batasi 16 digit

      setDataPribadi((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    if (name === "nomorRekening") {
      const numericValue = value.replace(/\D/g, ""); // hapus non-angka
      // if (numericValue.length > 16) return;

      setDataPribadi((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    const capitalizeFields = [
      "nama",
      "tempatLahir",
      "namaBank",
      "namaPemilik",
      "cabangBank",
    ];

    const formattedValue = capitalizeFields.includes(name)
      ? capitalizeWords(value)
      : value;
    setDataPribadi((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  useEffect(() => {
    const saved = localStorage.getItem("formPemodal");
    if (saved) {
      setDataPribadi(JSON.parse(saved));
    }
  }, []);

  // Auto simpan ke localStorage setiap ada perubahan dataPribadi
  useEffect(() => {
    const fullData = {
      ...dataPribadi,
      ...dataPekerjaan,
    };

    localStorage.setItem("formPemodal", JSON.stringify(fullData));
  }, [dataPribadi, dataPekerjaan]);

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

  const handleWeddingChange = (wedding: string) => {
    setDataPribadi((prev) => ({ ...prev, statusPernikahan: wedding }));
  };

  const handleEducationChange = (education: string) => {
    setDataPribadi((prev) => ({ ...prev, pendidikanTerakhir: education }));
  };

  const onPekerjaanChange = (value: string) => {
    setDataPribadi((prev) => ({
      ...prev,
      pekerjaan: value,
      pekerjaanLainnya: "",
    }));
  };

  const handleNext = () => {
    // const fullData = {
    //   ...dataPribadi,
    // };

    // localStorage.setItem("formPemodal", JSON.stringify(fullData));
    setSelectedIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const savedData = localStorage.getItem("formPemodal");

    if (!savedData) {
      // alert("Data tidak ditemukan di localStorage.");
      Swal.fire({
        title: "Gagal",
        text: "Data Tidak ditemukan.",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    try {
      const data = JSON.parse(savedData);

      const payload = {
        role: "1",
        ktp: {
          name: data.nama,
          place_datebirth: `${data.tempatLahir}, ${data.tanggalLahir}`,
          nik: data.nik,
          nik_path: data.ktpUrl,
        },
        gender: data.jenisKelamin === "Laki-Laki" ? "L" : "P",
        status_marital: data.statusPernikahan,
        last_education: data.pendidikanTerakhir,
        address_detail: data.addres,
        bank: {
          name: data.namaBank,
          no: data.nomorRekening,
          owner: data.namaPemilik,
          branch: data.cabangBank,
        },
        job: {
          company: data.namaPerusahaan,
          occupation:
            data.pekerjaan === "Lainnya"
              ? data.pekerjaanLainnya
              : data.pekerjaan,
          position: data.jabatan,
          monthly_revenue: data.penghasilanBulanan,
        },
        risk: {
          goal:
            data.tujuanInvestasi === "Lainnya"
              ? data.tujuanInvestasiLainnya
              : data.tujuanInvestasi,
          tolerance: data.toleransiResiko,
          experience: data.pengalamanInvestasi,
          pengetahuan_pasar_modal: data.pengetahuanPasarModal,
        },
      };

      console.log(payload, "payload");

      // const response = await axios.post("https://api-kamu.com/submit", payload);

      // if (response.status === 200) {
      // alert("Form berhasil dikirim!");
      Swal.fire({
        title: "Berhasil",
        text: "Data berhasil dikirim",
        icon: "success",
        timer: 3000,
      });

      // Hapus localStorage dan reset
      localStorage.removeItem("formPemodal");
      setSelectedIndex(0);
      // } else {
      //   alert("Gagal mengirim data. Silakan coba lagi.");
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert("Terjadi kesalahan saat mengirim data.");
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat mengirim data.",
        icon: "warning",
        timer: 3000,
      });
    }
  };

  return (
    <div className="bg-white px-10 md:px-24 py-24 w-full mx-auto text-black">
      {/* Step content */}
      {selectedIndex === 0 && (
        <div>
          <ComponentDataPribadi
            formData={dataPribadi}
            onChange={handleChangeDataPribadi}
            onGenderChange={handleGenderChange}
            onWeddingChange={handleWeddingChange}
            onEducationChange={handleEducationChange}
            onPekerjaanChange={onPekerjaanChange}
            onUploadKTP={(url: string) =>
              setDataPribadi((prev) => ({ ...prev, ktpUrl: url }))
            }
          />
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
            // onClick={() => {
            //   localStorage.removeItem("formPribadi");
            //   localStorage.removeItem("formBank");
            //   alert("Form telah selesai dan data dihapus dari localStorage.");
            //   setSelectedIndex(0);
            // }}
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default FormPemodal;
