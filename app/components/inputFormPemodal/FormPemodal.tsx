"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import ComponentDataPribadi from "./informasiPribadi/DataPribadi";
import ComponentDataPekerjaan from "./informasiPekerjaan/DataPekerjaan";
``;
const FormPemodal: React.FC = () => {
  type OptionType = { value: string; label: string } | null;
  const router = useRouter();
  const [token, setToken] = useState(null);
  // const userData = localStorage.getItem("user");
  // const user = userData ? JSON.parse(userData) : null;
  // const token = user?.token;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    setToken(user?.token);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorsPribadi, setErrorsPribadi] = useState<Record<string, string[]>>(
    {}
  );
  const [errorsPekerjaan, setErrorsPekerjaan] = useState<
    Record<string, string[]>
  >({});

  // Zod schema untuk Data Pribadi
  const schemaDataPribadi = z
    .object({
      nama: z.string().min(1, "Nama wajib diisi"),
      // nik: z.string().length(16, "NIK harus 16 digit"),
      nik: z
        .string({ required_error: "NIK wajib diisi" })
        .min(1, "NIK wajib diisi") // tampilkan error jika kosong
        .refine((val) => val.length === 16, {
          message: "NIK harus 16 digit",
        }),
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
      rekeningKoran: z.string().optional(), // jika perlu
      provincePribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Provinsi wajib dipilih",
        }),
      cityPribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kota wajib dipilih",
        }),
      districtPribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kecamatan wajib dipilih",
        }),
      subDistrictPribadi: z
        .object({
          value: z.string(),
          label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, {
          message: "Kelurahan wajib dipilih",
        }),

      posCode: z.string().min(1, "Kode pos wajib dipilih"),
    })
    .refine((data) => data.nama === data.namaPemilik, {
      message: "Nama pemilik rekening harus sama dengan nama",
      path: ["namaPemilik"],
    });

  // Zod schema untuk Data Pekerjaan
  const schemaDataPekerjaan = z.object({
    namaPerusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
    jabatan: z.string().min(1, "Jabatan wajib diisi"),
    alamatPerusahaan: z.string().min(1, "Alamat perusahaan wajib diisi"),
    penghasilanBulanan: z.string().min(1, "Penghasilan tahunan wajib diisi"),
    tujuanInvestasi: z.string().min(1, "Tujuan investasi wajib diisi"),
    tujuanInvestasiLainnya: z.string().optional(),
    toleransiResiko: z.string().min(1, "Toleransi resiko wajib diisi"),
    pengalamanInvestasi: z.string().min(1, "Pengalaman investasi wajib diisi"),
    pengetahuanPasarModal: z
      .string()
      .min(1, "Pengetahuan pasar modal wajib diisi"),
    setujuKebenaranData: z.literal(true),
    setujuRisikoInvestasi: z.literal(true),
    signature: z.string().min(1, "Tanda tangan wajib"),
    npwpUrl: z.string().min(1, "Upload NPWP wajib"),
    fotoPemodalUrl: z.string().min(1, "Upload Foto wajib"),
    provincePekerjaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Provinsi wajib dipilih",
      }),
    cityPekerjaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Kota wajib dipilih",
      }),
    districtPekerjaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Kecamatan wajib dipilih",
      }),
    subDistrictPekerjaan: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Kelurahan wajib dipilih",
      }),

    posCodePekerjaan: z.string().min(1, "Kode pos wajib dipilih"),
  });

  const [dataPribadi, setDataPribadi] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodal");
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
          provincePribadi: parsed.provincePribadi ?? null,
          cityPribadi: parsed.cityPribadi ?? null,
          districtPribadi: parsed.districtPribadi ?? null,
          subDistrictPribadi: parsed.subDistrictPribadi ?? null,
          posCode: parsed.posCode || "",
        };
      }
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
      provincePribadi: null,
      cityPribadi: null,
      districtPribadi: null,
      subDistrictPribadi: null,
      posCode: "",
    };
  });

  const [dataPekerjaan, setDataPekerjaan] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodal");
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
          fotoPemodalUrl: parsed.fotoPemodalUrl || "",
          provincePekerjaan: parsed.provincePekerjaan ?? null,
          cityPekerjaan: parsed.cityPekerjaan ?? null,
          districtPekerjaan: parsed.districtPekerjaan ?? null,
          subDistrictPekerjaan: parsed.subDistrictPekerjaan ?? null,
          posCodePekerjaan: parsed.posCodePekerjaan || "",
        };
      }
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
      fotoPemodalUrl: "",
      provincePekerjaan: null,
      cityPekerjaan: null,
      districtPekerjaan: null,
      subDistrictPekerjaan: null,
      posCodePekerjaan: "",
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
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formPemodal");
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
          provincePribadi: parsed.provincePribadi ?? null,
          cityPribadi: parsed.cityPribadi ?? null,
          districtPribadi: parsed.districtPribadi ?? null,
          subDistrictPribadi: parsed.subDistrictPribadi ?? null,
          posCode: parsed.posCode || "",
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
          fotoPemodalUrl: parsed.fotoPemodalUrl || "",
          provincePekerjaan: parsed.provincePekerjaan ?? null,
          cityPekerjaan: parsed.cityPekerjaan ?? null,
          districtPekerjaan: parsed.districtPekerjaan ?? null,
          subDistrictPekerjaan: parsed.subDistrictPekerjaan ?? null,
          posCodePekerjaan: parsed.posCodePekerjaan || "",
        });
      }
    }
  }, []);

  // Auto simpan ke localStorage setiap ada perubahan dataPribadi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullData = {
        ...dataPribadi,
        ...dataPekerjaan,
      };

      localStorage.setItem("formPemodal", JSON.stringify(fullData));
    }
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

  const handleAlamatChange = (alamat: {
    provincePribadi: OptionType;
    cityPribadi: OptionType;
    districtPribadi: OptionType;
    subDistrictPribadi: OptionType;
    posCode: string;
  }) => {
    setDataPribadi((prev) => ({
      ...prev,
      provincePribadi: alamat.provincePribadi,
      cityPribadi: alamat.cityPribadi,
      districtPribadi: alamat.districtPribadi,
      subDistrictPribadi: alamat.subDistrictPribadi,
      posCode: alamat.posCode,
    }));
  };

  const handleAlamatPekerjaanChange = (alamat: {
    provincePekerjaan: OptionType;
    cityPekerjaan: OptionType;
    districtPekerjaan: OptionType;
    subDistrictPekerjaan: OptionType;
    posCodePekerjaan: string;
  }) => {
    setDataPekerjaan((prev) => ({
      ...prev,
      provincePekerjaan: alamat.provincePekerjaan,
      cityPekerjaan: alamat.cityPekerjaan,
      districtPekerjaan: alamat.districtPekerjaan,
      subDistrictPekerjaan: alamat.subDistrictPekerjaan,
      posCodePekerjaan: alamat.posCodePekerjaan,
    }));
  };

  const validateStep0 = () => {
    const result = schemaDataPribadi.safeParse(dataPribadi);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setErrorsPribadi(errors); // untuk ditampilkan di UI
      return false;
    }
    setErrorsPribadi({});
    return true;
  };

  const validateStep1 = () => {
    const result = schemaDataPekerjaan.safeParse(dataPekerjaan);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setErrorsPekerjaan(errors); // untuk ditampilkan di UI
      return false;
    }
    setErrorsPekerjaan({});
    return true;
  };

  const handleNext = () => {
    // const fullData = {
    //   ...dataPribadi,
    // };

    // validasi jika next
    if (selectedIndex === 0) {
      const isValid = validateStep0();
      if (!isValid) return;
    }

    setSelectedIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const savedData = localStorage.getItem("formPemodal");

    if (!savedData) {
      Swal.fire({
        title: "Gagal",
        text: "Data Tidak ditemukan.",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    if (selectedIndex === 1) {
      const isValid = validateStep1();
      if (!isValid) return;
    }

    try {
      const data = JSON.parse(savedData);

      // const fullSchema = schemaDataPribadi.merge(schemaDataPekerjaan);
      // const result = fullSchema.safeParse(data);

      // if (!result.success) {
      //   const firstError = result.error.errors[0];
      //   Swal.fire({
      //     title: "Data belum diisi!",
      //     text: firstError.message,
      //     icon: "warning",
      //     timer: 3000,
      //   });
      //   return;
      // }

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
        province_name: data.provincePribadi.label,
        city_name: data.cityPribadi.label,
        district_name: data.districtPribadi.label,
        subdistrict_name: data.subDistrictPribadi.label,
        postal_code: data.posCode,
        address_detail: data.addres,
        avatar: data.fotoPemodalUrl,
        occupation:
          data.pekerjaan === "Lainnya" ? data.pekerjaanLainnya : data.pekerjaan,
        signature_path: data.signature,
        location: {
          name: "-",
          url: "-",
          lat: "-",
          lng: "-",
        },
        doc: {
          id: "-",
          path: "-",
        },
        capital: "-",
        roi: "-",
        min_invest: "-",
        unit_price: "-",
        unit_total: "-",
        number_of_unit: "-",
        periode: "-",
        bank: {
          name: data.namaBank,
          no: data.nomorRekening,
          owner: data.namaPemilik,
          branch: data.cabangBank,
          rek_koran_path: data.rekeningKoran,
        },
        job: {
          province_name: data.provincePekerjaan.label,
          city_name: data.cityPekerjaan.label,
          district_name: data.districtPekerjaan.label,
          subdistrict_name: data.subDistrictPekerjaan.label,
          postal_code: data.posCodePekerjaan.label,
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

      console.log(payload, "payload");

      const response = await axios.post(
        "https://api-capbridge.langitdigital78.com/api/v1/auth/assign/role",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // if (response.status === 200) {
      // alert("Form berhasil dikirim!");
      const alertSwal = await Swal.fire({
        title: "Berhasil",
        text: "Data berhasil dikirim",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        // showConfirmButton: false,
      });

      // Hapus localStorage dan reset
      localStorage.removeItem("formPemodal");
      localStorage.removeItem("signature");
      Cookies.remove("formPemodal");
      setSelectedIndex(0);
      router.push("/");
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
    // px-3 md:px-10 py-20 md:py-30
    // px-10 md:px-24 py-24
    <div className="bg-white w-full mx-auto text-black px-10 md:px-24 py-24">
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
            onAlamatChange={handleAlamatChange}
            errors={errorsPribadi}
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
            onAlamatChange={handleAlamatPekerjaanChange}
            errors={errorsPekerjaan}
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
                : "bg-purple-600 hover:bg-purple-700"
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
            // className="px-4 py-2 bg-green-600 text-white rounded" bg-[#4821C2]
            disabled={
              !dataPekerjaan.setujuKebenaranData ||
              !dataPekerjaan.setujuRisikoInvestasi
            }
            className={`px-8 py-2 rounded text-white ${
              !dataPekerjaan.setujuKebenaranData ||
              !dataPekerjaan.setujuRisikoInvestasi
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
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
