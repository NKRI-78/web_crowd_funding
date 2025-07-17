"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import FileUpload from "@/app/helper/FileUpload";
import Select, { SingleValue } from "react-select";
import { API_BACKEND } from "@/app/utils/constant";
import { fetchCities, fetchProvinces } from "@/app/lib/fetchWilayah";
import FormAlamat from "./FormAlamat";

export const alamatSchema = z.object({
  label: z.string().optional(),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  kabupaten: z.string().min(1, "Kota wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  kelurahan: z.string().min(1, "Kelurahan wajib diisi"),
  kodePos: z.string().min(1, "Kode pos wajib diisi"),
  detailAlamat: z.string().min(1, "Detail alamat wajib diisi"),
});

const schema = z.object({
  namaPerusahaan: z.string().min(1, "Nama perusahaan wajib diisi"),
  alamat: z
    .array(alamatSchema)
    .min(1, "Minimal 1 alamat harus diisi")
    .max(2, "Maksimal hanya 2 alamat"),
  detailKorespondensi: z.string().optional(),
  jumlahKaryawan: z.number().min(0, "Jumlah karyawan harus valid").optional(),
  fileNIB: z.string().optional(),
  fileAkte: z.string().optional(),
  fileSIUP: z.string().optional(),
  fileTDP: z.string().optional(),
  fileNpwp: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const fetchOptions = async (url: string, parentId?: string) => {
  try {
    const response = await axios.get(
      `${API_BACKEND}/${url}${parentId ? `/${parentId}` : ""}`
    );
    console.log("URL", `${API_BACKEND}/${url}${parentId ? `/${parentId}` : ""}`);

    return response.data?.data.map((item: any) => ({
      value: String(item.id),
      label: item.name,
    }));
  } catch (error) {
    console.error("Failed to fetch options:", error);
    return [];
  }
};

type OptionType = { value: string; label: string };

export default function PublisherForm() {
  const [isReady, setIsReady] = useState(false);

  const [provinsiList, setProvinsiList] = useState<OptionType[]>([]);
  const [kotaList, setKotaList] = useState<Record<number, OptionType[]>>({});
  const [kecamatanList, setKecamatanList] = useState<
    Record<number, OptionType[]>
  >({});
  const [kelurahanList, setKelurahanList] = useState<
    Record<number, OptionType[]>
  >({});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      jumlahKaryawan: 0,
      fileNIB: "",
      fileAkte: "",
      fileSIUP: "",
      fileTDP: "",
      alamat: [
        {
          label: "Alamat Perusahaan",
          provinsi: "",
          kabupaten: "",
          kecamatan: "",
          kelurahan: "",
          kodePos: "",
          detailAlamat: "",
        },
        {
          label: "Alamat Korespondensi",
          provinsi: "",
          kabupaten: "",
          kecamatan: "",
          kelurahan: "",
          kodePos: "",
          detailAlamat: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({ control, name: "alamat" });

  useEffect(() => {
    const loadProvinces = async () => {
      const provinsiList = await fetchProvinces();
      setProvinsiList(provinsiList);
    };
    loadProvinces();
  }, []);
  useEffect(() => {
    fields.forEach((_, index) => {
      const provId = watch(`alamat.${index}.provinsi`);
      if (provId) {
        fetchCities(provId).then((data) =>
          setCityList((prev) => ({ ...prev, [index]: data }))
        );
      }
    });
  }, [watch("alamat")]);

  const [cityList, setCityList] = useState<Record<number, OptionType[]>>({});
  const [districtList, setDistrictList] = useState<
    Record<number, OptionType[]>
  >({});
  const [subdistrictList, setSubdistrictList] = useState<
    Record<number, OptionType[]>
  >({});

  useEffect(() => {
    fields.forEach((_, index) => {
      const provId = watch(`alamat.${index}.provinsi`);
      if (provId) {
        fetchCities(provId).then((data) =>
          setCityList((prev) => ({ ...prev, [index]: data }))
        );
      }
    });
  }, [watch("alamat")]);

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", "capbridge");
    formData.append("media", file);

    try {
      const res = await axios.post(
        "https://api-media.inovatiftujuh8.com/api/v1/media/upload",
        formData
      );

      const fileUrl = res.data?.data?.path;
      if (fileUrl) {
        setValue(field, fileUrl);
        alert(`Upload ${field} berhasil!`);
      } else {
        alert(`Upload ${field} gagal!`);
      }
    } catch (error) {
      alert(`Upload ${field} error!`);
    }
  };

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
    if (!isReady) return;

    const timeout = setTimeout(() => {
      localStorage.setItem("publisherDraft", JSON.stringify(values));
    }, 1000); // hanya simpan setelah 1 detik tidak ada perubahan

    return () => clearTimeout(timeout);
  }, [values, isReady]);

  const onSubmit = async (data: FormData) => {
    try {
      // console.log("Data ", data.kabupaten)
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

  if (!isReady) {
    return <p>Loading...</p>; // Tunggu reset jalan dulu
  }

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

          {/* Upload NIB */}
          <FileUpload
            label="Nomor Induk Berusaha (NIB)"
            fileUrl={watch("fileNIB")}
            onUpload={(e) => handleUploadFile(e, "fileNIB")}
          />

          {/* Upload Akte */}
          <FileUpload
            label="Akte Pendirian"
            fileUrl={watch("fileAkte")}
            onUpload={(e) => handleUploadFile(e, "fileAkte")}
          />

          {/* Upload SIUP */}
          <FileUpload
            label="SIUP"
            fileUrl={watch("fileSIUP")}
            onUpload={(e) => handleUploadFile(e, "fileSIUP")}
          />

          {/* Upload TDP */}
          <FileUpload
            label="TDP"
            fileUrl={watch("fileTDP")}
            onUpload={(e) => handleUploadFile(e, "fileTDP")}
          />

          <FileUpload
            label="NPWP Perusahaan"
            fileUrl={watch("fileNpwp")}
            onUpload={(e) => handleUploadFile(e, "fileNpwp")}
          />
        </div>

        {/* Kanan */}
        <div className="space-y-4">
          {fields.map((item, index) => (
            <FormAlamat
              key={item.id}
              index={index}
              control={control}
              setValue={setValue}
              watch={watch}
              register={register}
              provinsiList={provinsiList}
              kotaList={kotaList}
              setKotaList={setKotaList}
              kecamatanList={kecamatanList}
              setKecamatanList={setKecamatanList}
              kelurahanList={kelurahanList}
              setKelurahanList={setKelurahanList}
              fetchOptions={fetchOptions}
            />
          ))}

          <div>
            <label className="block mb-1">Jumlah Karyawan</label>
            <div className="flex items-center border rounded overflow-hidden w-80">
              <input
                {...register("jumlahKaryawan", { valueAsNumber: true })}
                type="number"
                className="px-3 py-2 outline-none flex-1"
                placeholder="0"
              />
              <span className="px-3 py-2 border-l bg-gray-100 text-gray-500 text-sm">
                Orang
              </span>
            </div>
            {errors.jumlahKaryawan && (
              <p className="text-red-500 text-sm">
                {errors.jumlahKaryawan.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* <button
              type="button"
              onClick={() => {
                alert("Draft disimpan!");
              }}
              className="flex-1 border border-gray-400 py-2 rounded"
            >
              Save as Draft
            </button> */}
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
function setCityList(arg0: (prev: any) => any): any {
  throw new Error("Function not implemented.");
}
