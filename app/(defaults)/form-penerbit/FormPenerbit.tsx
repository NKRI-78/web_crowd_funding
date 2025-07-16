"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";

const schema = z.object({
  namaPerusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
  provinsi: z.string().optional(),
  kabupaten: z.string().optional(),
  kota: z.string().optional(),
  kecamatan: z.string().optional(),
  kelurahan: z.string().optional(),
  kodePos: z.string().optional(),
  detailAlamat: z.string().optional(),
  detailKorespondensi: z.string().optional(),
  jumlahKaryawan: z.number().min(0, "Jumlah karyawan harus valid").optional(),
  fileNIB: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PublisherForm() {
  const [isReady, setIsReady] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      jumlahKaryawan: 0,
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Load draft hanya di client
  useEffect(() => {
    const draft = localStorage.getItem("publisherDraft");
    if (draft) {
      reset(JSON.parse(draft));
    }
    setIsReady(true);
  }, [reset]);

  // ✅ Simpan draft setiap perubahan
  const values = watch();
  useEffect(() => {
    if (isReady) {
      localStorage.setItem("publisherDraft", JSON.stringify(values));
    }
  }, [values, isReady]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post("/api/publisher", data);
      console.log("Res:", res.data);

      localStorage.removeItem("publisherDraft");
      alert("Berhasil disimpan!");
      reset();
    } catch (err) {
      console.error(err);
      alert("Gagal submit");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (!isReady) {
    return <p>Loading...</p>; // Tunggu reset jalan dulu
  }

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", "capbridge");
    formData.append("media", file);

    const res = await axios.post(
      "https://api-media.inovatiftujuh8.com/api/v1/media/upload",
      formData
    );
    const fileUrl = res.data;
    if (fileUrl) {
      setValue("fileNIB", fileUrl["data"]["path"]);
      alert("Upload berhasil!");
    } else {
      alert("Upload gagal!");
    }
  };

  return (
    <section className="bg-white text-black items-center px-3 md:px-10 py-20 md:py-30">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto"
      >
        {/* Kiri */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Isi Data Sebagai Penerbit</h2>
          <p className="text-sm text-gray-600">
            Untuk memastikan kelancaran proses verifikasi dan layanan yang
            optimal, lengkapi data secara jujur, benar, dan akurat.
          </p>

          <h3 className="font-semibold text-black">1. Informasi Penerbit</h3>

          <div>
            <label className="block mb-1 text-black">Nama Perusahaan</label>
            <input
              {...register("namaPerusahaan")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.namaPerusahaan && (
              <p className="text-red-500 text-sm">
                {errors.namaPerusahaan.message}
              </p>
            )}
          </div>

          <>
            <p className="text-sm mb-1">Nomor Induk Perusahaan (NIB)</p>
            {/* Tombol custom */}
            <button
              onClick={handleButtonClick}
              type="button"
              className="flex flex-row items-center content-center w-56 bg-gray-800 text-white py-2 rounded-lg"
            >
              <FaFileAlt size={20} className="mx-2" /> Upload Dokumen
            </button>

            {/* Input file hidden */}
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleUploadFile}
              className="hidden"
            />

            {values.fileNIB && (
              <a
                href={values.fileNIB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm block mt-2"
              >
                Lihat Dokumen NIB
              </a>
            )}
            <p className="text-xs text-gray-500">
              File maksimal berukuran 10mb
            </p>
          </>
          {[
            "Akte Pendirian Perusahaan",
            "SK Kumham Pendirian",
            "Akte Perubahan Terakhir",
            "SK Kumham Terakhir",
          ].map((label, idx) => (
            <>
              <div key={idx}>
                <p className="text-sm mb-1">{label}</p>
                <button
                  type="button"
                  className="flex flex-row items-center content-center w-56 bg-gray-800 text-white py-2 rounded-lg"
                >
                  <FaFileAlt size={20} className="mx-2" /> Upload Dokumen
                </button>
                <p className="text-xs text-gray-500">
                  File maksimal berukuran 10mb
                </p>
              </div>
            </>
          ))}
        </div>

        {/* Kanan */}
        <div className="space-y-4">
          <h3 className="font-semibold">Alamat Perusahaan</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("provinsi")}
              placeholder="Provinsi"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              {...register("kabupaten")}
              placeholder="Kabupaten"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              {...register("kota")}
              placeholder="Kota"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              {...register("kecamatan")}
              placeholder="Kecamatan"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              {...register("kelurahan")}
              placeholder="Kelurahan"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              {...register("kodePos")}
              placeholder="Kode Pos"
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <textarea
            {...register("detailAlamat")}
            placeholder="Detail Alamat"
            className="w-full border px-3 py-2 rounded"
          />

          <h3 className="font-semibold">Alamat Korespondensi</h3>
          <textarea
            {...register("detailKorespondensi")}
            placeholder="Detail Alamat"
            className="w-full border px-3 py-2 rounded"
          />

          <div>
            <p className="text-sm mb-1">NPWP Perusahaan</p>
            <button
              type="button"
              className="flex flex-row items-center content-center w-56 bg-gray-800 text-white py-2 rounded-lg"
            >
              <FaFileAlt size={20} className="mx-2" /> Upload Dokumen
            </button>
            <p className="text-xs text-gray-500">
              File maksimal berukuran 10mb
            </p>
          </div>

          <div>
            <label className="block mb-1">Jumlah Karyawan</label>
            <input
              {...register("jumlahKaryawan", { valueAsNumber: true })}
              type="number"
              className="border px-3 py-2 rounded w-full"
              placeholder="Orang"
            />
            {errors.jumlahKaryawan && (
              <p className="text-red-500 text-sm">
                {errors.jumlahKaryawan.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={() => {
                alert("Draft disimpan!");
              }}
              className="flex-1 border border-gray-400 py-2 rounded"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? "Loading..." : "Lanjutkan"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
