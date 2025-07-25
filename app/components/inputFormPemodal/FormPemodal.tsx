"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import ComponentDataPribadi from "./informasiPribadi/DataPribadi";
import ComponentDataPekerjaan from "./informasiPekerjaan/DataPekerjaan";
import { BASE_URL } from "@/app/utils/constant";

const FormPemodal: React.FC = () => {
  const router = useRouter();
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
  const token = user?.token;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const schema = z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    nik: z.string().length(16, "NIK harus 16 digit"),
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
    jenisKelamin: z.string().min(1, "Jenis kelamin wajib diisi"),
    statusPernikahan: z.string().min(1, "Status pernikahan wajib diisi"),
    pendidikanTerakhir: z.string().min(1, "Pendidikan terakhir wajib diisi"),
    pekerjaan: z.string().min(1, "Pekerjaan wajib diisi"),
    pekerjaanLainnya: z.string().optional(),
    addres: z.string().min(1, "Alamat wajib diisi"),
    namaBank: z.string().min(1, "Nama bank wajib diisi"),
    nomorRekening: z.string().min(1, "Nomor rekening wajib diisi"),
    namaPemilik: z.string().min(1, "Nama pemilik rekening wajib diisi"),
    cabangBank: z.string().min(1, "Cabang bank wajib diisi"),
    ktpUrl: z.string().min(1, "Upload KTP wajib"),

    namaPerusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
    jabatan: z.string().min(1, "Jabatan wajib diisi"),
    alamatPerusahaan: z.string().min(1, "Alamat perusahaan wajib diisi"),
    penghasilanBulanan: z.string().min(1, "Penghasilan bulanan wajib diisi"),
    tujuanInvestasi: z.string().min(1, "Tujuan investasi wajib diisi"),
    tujuanInvestasiLainnya: z.string().optional(),
    toleransiResiko: z.string().min(1, "Toleransi resiko wajib diisi"),
    pengalamanInvestasi: z.string().min(1, "Pengalaman investasi wajib diisi"),
    pengetahuanPasarModal: z
      .string()
      .min(1, "Pengalaman pasar modal wajib diisi"),
    setujuKebenaranData: z.literal(true),
    setujuRisikoInvestasi: z.literal(true),
    signature: z.string().min(1, "Tanda tangan wajib"),
  });

  const [dataPribadi, setDataPribadi] = useState(() => {
    const saved = Cookies.get("formPemodal");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        nama: parsed.nama || "",
        nik: parsed.nik || "",
        tempatLahir: parsed.tempatLahir || "",
        tanggalLahir: parsed.tanggalLahir || "",
        jenisKelamin: parsed.jenisKelamin || "",
        statusPernikahan: parsed.statusPernikahan || "",
        pendidikanTerakhir: parsed.pendidikanTerakhir || "",
        pekerjaan: parsed.pekerjaan || "",
        pekerjaanLainnya: parsed.pekerjaanLainnya || "",
        addres: parsed.addres || "",
        namaBank: parsed.namaBank || "",
        nomorRekening: parsed.nomorRekening || "",
        namaPemilik: parsed.namaPemilik || "",
        cabangBank: parsed.cabangBank || "",
        ktpUrl: parsed.ktpUrl || "",
        rekeningKoran: parsed.rekeningKoran || "",
      };
    }
    return {
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
      rekeningKoran: "",
    };
  });

  const [dataPekerjaan, setDataPekerjaan] = useState(() => {
    const saved = Cookies.get("formPemodal");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        namaPerusahaan: parsed.namaPerusahaan || "",
        jabatan: parsed.jabatan || "",
        alamatPerusahaan: parsed.alamatPerusahaan || "",
        penghasilanBulanan: parsed.penghasilanBulanan || "",
        tujuanInvestasi: parsed.tujuanInvestasi || "",
        tujuanInvestasiLainnya: parsed.tujuanInvestasiLainnya || "",
        toleransiResiko: parsed.toleransiResiko || "",
        pengalamanInvestasi: parsed.pengalamanInvestasi || "",
        pengetahuanPasarModal: parsed.pengetahuanPasarModal || "",
        setujuKebenaranData: parsed.setujuKebenaranData || false,
        setujuRisikoInvestasi: parsed.setujuRisikoInvestasi || false,
        signature: parsed.signature || "",
        npwpUrl: parsed.npwpUrl || "",
      };
    }
    return {
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
      npwpUrl: "",
    };
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

    if (name === "nik") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 16) return;

      setDataPribadi((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    if (name === "nomorRekening") {
      const numericValue = value.replace(/\D/g, "");

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
    const saved = Cookies.get("formPemodal");

    if (saved) {
      const parsed = JSON.parse(saved);

      setDataPribadi({
        nama: parsed.nama || "",
        nik: parsed.nik || "",
        tempatLahir: parsed.tempatLahir || "",
        tanggalLahir: parsed.tanggalLahir || "",
        jenisKelamin: parsed.jenisKelamin || "",
        statusPernikahan: parsed.statusPernikahan || "",
        pendidikanTerakhir: parsed.pendidikanTerakhir || "",
        pekerjaan: parsed.pekerjaan || "",
        pekerjaanLainnya: parsed.pekerjaanLainnya || "",
        addres: parsed.addres || "",
        namaBank: parsed.namaBank || "",
        nomorRekening: parsed.nomorRekening || "",
        namaPemilik: parsed.namaPemilik || "",
        cabangBank: parsed.cabangBank || "",
        ktpUrl: parsed.ktpUrl || "",
        rekeningKoran: parsed.rekeningKoran || "",
      });

      setDataPekerjaan({
        namaPerusahaan: parsed.namaPerusahaan || "",
        jabatan: parsed.jabatan || "",
        alamatPerusahaan: parsed.alamatPerusahaan || "",
        penghasilanBulanan: parsed.penghasilanBulanan || "",
        tujuanInvestasi: parsed.tujuanInvestasi || "",
        tujuanInvestasiLainnya: parsed.tujuanInvestasiLainnya || "",
        toleransiResiko: parsed.toleransiResiko || "",
        pengalamanInvestasi: parsed.pengalamanInvestasi || "",
        pengetahuanPasarModal: parsed.pengetahuanPasarModal || "",
        setujuKebenaranData: parsed.setujuKebenaranData || false,
        setujuRisikoInvestasi: parsed.setujuRisikoInvestasi || false,
        signature: parsed.signature || "",
        npwpUrl: parsed.npwpUrl || "",
      });
    }
  }, []);

  useEffect(() => {
    const fullData = {
      ...dataPribadi,
      ...dataPekerjaan,
    };

    Cookies.set("formPemodal", JSON.stringify(fullData));
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
    setSelectedIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const savedData = Cookies.get("formPemodal");

    if (!savedData) {
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

      const result = schema.safeParse(data);
      if (!result.success) {
        const firstError = result.error.errors[0];

        Swal.fire({
          title: "Data belum diisi!",
          text: firstError.message,
          icon: "warning",
          timer: 3000,
        });
        return;
      }
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
        occupation:
          data.pekerjaan === "Lainnya" ? data.pekerjaanLainnya : data.pekerjaan,
        signature_path: data.signature,
        bank: {
          name: data.namaBank,
          no: data.nomorRekening,
          owner: data.namaPemilik,
          branch: data.cabangBank,
          rek_koran_path: data.rekeningKoran,
        },
        job: {
          company: data.namaPerusahaan,
          address: data.alamatPerusahaan,
          position: data.jabatan,
          monthly_income: data.penghasilanBulanan,
          npwp_path: data.npwpUrl,
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

      await axios.post(`${BASE_URL}/api/v1/auth/assign/role`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const alertSwal = await Swal.fire({
        title: "Berhasil",
        text: "Data berhasil dikirim",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
      });

      localStorage.removeItem("formPemodal");
      localStorage.removeItem("signature");
      Cookies.remove("formPemodal");
      setSelectedIndex(0);
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
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
            onUploadKTP={(url: string, keyName: string) =>
              setDataPribadi((prev) => ({ ...prev, [keyName]: url }))
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
            onUploadKTP={(url: string, keyName: string) =>
              setDataPekerjaan((prev) => ({ ...prev, [keyName]: url }))
            }
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-5 mt-10">
        <button
          onClick={() => setSelectedIndex((prev) => prev - 1)}
          disabled={selectedIndex === 0}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
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
            onClick={handleSubmit}
            disabled={
              !dataPekerjaan.setujuKebenaranData ||
              !dataPekerjaan.setujuRisikoInvestasi
            }
            className={`px-8 py-2 rounded text-white ${
              !dataPekerjaan.setujuKebenaranData ||
              !dataPekerjaan.setujuRisikoInvestasi
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4821C2]"
            }`}
          >
            Kirim Data
          </button>
        )}
      </div>
    </div>
  );
};

export default FormPemodal;
