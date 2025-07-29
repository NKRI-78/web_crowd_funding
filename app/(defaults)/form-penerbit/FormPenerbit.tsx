"use client";

import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import FormButton from "@/app/components/inputFormPenerbit/_component/FormButton";
import Swal from "sweetalert2";

export const alamatSchema = z.object({
  name: z.string().optional(),
  province_id: z.string().min(1, "Provinsi wajib diisi"),
  province_name: z.string(),
  city_id: z.string().min(1, "Kota wajib diisi"),
  city_name: z.string().min(1, "Kota wajib diisi"),
  district_id: z.string().min(1, "Kecamatan wajib diisi"),
  district_name: z.string().min(1, "Kecamatan wajib diisi"),
  subdistrict_id: z.string().min(1, "Kelurahan wajib diisi"),
  subdistrict_name: z.string().min(1, "Kelurahan wajib diisi"),
  postal_code: z.string().min(1, "Kode pos wajib diisi"),
  detail: z.string().min(1, "Detail alamat wajib diisi"),
});

const existingCompanies = ["Google", "Microsoft", "OpenAI"];

export const schema = z.object({
  company_name: z
    .string()
    .min(1, "Nama perusahaan wajib diisi")
    .refine((val) => !existingCompanies.includes(val), {
      message: "Nama perusahaan sudah terdaftar",
    }),
  address: z
    .array(alamatSchema)
    .min(1, "Minimal 1 alamat harus diisi")
    .max(2, "Maksimal hanya 2 alamat"),
  sameAsCompany: z.boolean().optional(),
  detailKorespondensi: z.string().optional(),
  total_employees: z.string().min(1, "Jumlah karyawan minimal 1").optional(),
  company_nib_path: z
    .string()
    .min(1, { message: "Dokumen NIB wajib diunggah" }),
  akta_pendirian: z
    .string()
    .min(1, { message: "Akte pendirian wajib diunggah" }),
  sk_kumham_path: z.string().min(1, { message: "SK Kumham wajib diunggah" }),
  akta_perubahan_terahkir_path: z
    .string()
    .min(1, { message: "Akte perubahan terakhir wajib diunggah" }),
  sk_kumham_terahkir: z
    .string()
    .min(1, { message: "SK Kumham terakhir wajib diunggah" }),
  // npwp_path: z.string().min(1, { message: "NPWP perusahaan wajib diunggah" }),
  fileNpwp: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

const fetchOptions = async (url: string, parentId?: string) => {
  try {
    const response = await axios.get(
      `${API_BACKEND}/${url}${parentId ? `/${parentId}` : ""}`
    );
    console.log(
      "URL",
      `${API_BACKEND}/${url}${parentId ? `/${parentId}` : ""}`
    );

    return response.data?.data.map((item: any) => ({
      value: String(item.id),
      label: item.name,
      zip_code: item.zip_code, // Tambahkan zip_code di dalam option
    }));
  } catch (error) {
    console.error("Failed to fetch options:", error);
    return [];
  }
};

type OptionType = { value: string; label: string; zip_code: string };

type Props = {
  onNext: () => void;
};

export default function PublisherForm({ onNext }: Props) {
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
    reset,
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      sameAsCompany: false,
      total_employees: "",
      company_nib_path: "",
      akta_pendirian: "",
      sk_kumham_path: "",
      akta_perubahan_terahkir_path: "",
      sk_kumham_terahkir: "",
      // npwp_path: "",
      address: [
        {
          name: "Company",
          province_id: "",
          city_id: "",
          district_id: "",
          subdistrict_id: "",
          postal_code: "",
          detail: "",
        },
        {
          name: "Koresponden",
          province_id: "",
          city_id: "",
          district_id: "",
          subdistrict_id: "",
          postal_code: "",
          detail: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({ control, name: "address" });

  const alamatPerusahaan = useWatch({
    control,
    name: "address.0",
  });

  const sameAsCompany = useWatch({
    control,
    name: "sameAsCompany",
  });

  useEffect(() => {
    if (!sameAsCompany) return;

    // Ketika checkbox aktif, update address[1] setiap kali address[0] berubah
    setValue("address.1", {
      ...alamatPerusahaan,
      name: "Koresponden", // jangan lupa ubah label
    });
  }, [alamatPerusahaan, sameAsCompany]);

  useEffect(() => {
    const loadProvinces = async () => {
      const provinsiList = await fetchProvinces();
      setProvinsiList(provinsiList);
    };
    loadProvinces();
  }, []);

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      Swal.fire({
        title: "Ukuran File Terlalu Besar",
        text: `Maksimal ukuran file adalah ${maxSizeInMB}MB.`,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

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

      const uploadMessages = {
        company_nib_path: "Upload NIB Perusahaan berhasil!",
        akta_pendirian: "Upload Akta Pendirian berhasil!",
        sk_kumham_path: "Upload SK KUMHAM berhasil!",
        akta_perubahan_terahkir_path:
          "Upload Akta Perubahan Terakhir berhasil!",
        sk_kumham_terahkir: "Upload SK KUMHAM Terakhir berhasil!",
        // npwp_path: "Upload Rekening Koran berhasil!",
      } as const;

      if (fileUrl) {
        setValue(field, fileUrl, { shouldValidate: true });
        if (field in uploadMessages) {
          const message = uploadMessages[field as keyof typeof uploadMessages];
          Swal.fire({
            title: "Berhasil",
            text: message,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
        }
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
      console.log("Data, ", data);
      // localStorage.removeItem("publisherDraft");
      // alert("Berhasil disimpan!");
      // reset();
      onNext();
    } catch (err) {
      console.error(err);
      alert("Gagal submit");
    }
  };

  if (!isReady) {
    return <p>Loading...</p>; // Tunggu reset jalan dulu
  }

  const showErrorToasts = () => {
    Object.values(errors).forEach((err) => {
      if (!err?.message) return;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = raw.replace(/\D/g, "");
    // if (/^\d*$/.test(input)) {
    setValue("total_employees", numeric);
    // }
  };

  return (
    <section className="bg-white text-black items-center px-3 md:px-10 py-20 md:py-30">
      <form
        onSubmit={handleSubmit(onSubmit, showErrorToasts)}
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
            <label className="block mb-1 text-black">
              Nama Perusahaan<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("company_name")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm">
                {errors.company_name.message}
              </p>
            )}
          </div>

          <FileUpload
            label="Nomor Induk Berusaha (NIB)"
            fileUrl={watch("company_nib_path")}
            onUpload={(e) => handleUploadFile(e, "company_nib_path")}
            error={errors?.company_nib_path?.message}
          />

          <FileUpload
            label="Akte Pendirian Perusahaan"
            fileUrl={watch("akta_pendirian")}
            onUpload={(e) => handleUploadFile(e, "akta_pendirian")}
            error={errors?.akta_pendirian?.message}
          />

          <FileUpload
            label="SK Kumham Pendirian"
            fileUrl={watch("sk_kumham_path")}
            onUpload={(e) => handleUploadFile(e, "sk_kumham_path")}
            error={errors?.sk_kumham_path?.message}
          />

          <FileUpload
            label="Akte Perubahan Terakhir"
            fileUrl={watch("akta_perubahan_terahkir_path")}
            onUpload={(e) =>
              handleUploadFile(e, "akta_perubahan_terahkir_path")
            }
            error={errors?.akta_perubahan_terahkir_path?.message}
          />

          <FileUpload
            label="SK Kumham Terakhir"
            fileUrl={watch("sk_kumham_terahkir")}
            onUpload={(e) => handleUploadFile(e, "sk_kumham_terahkir")}
            error={errors?.sk_kumham_terahkir?.message}
          />

          {/* <FileUpload
            label="Rekening Koran"
            fileUrl={watch("npwp_path")}
            onUpload={(e) => handleUploadFile(e, "npwp_path")}
            error={errors?.npwp_path?.message}
          /> */}
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
              errors={errors}
              sameAsCompany={watch("sameAsCompany") ?? false}
            />
          ))}

          <div>
            <label className="block mb-1">
              Jumlah Karyawan<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center border rounded overflow-hidden w-80">
              <input
                {...register("total_employees")}
                type="text"
                onChange={handleNumberChange}
                className="px-3 py-2 outline-none flex-1"
                placeholder="0"
              />
              <span className="px-3 py-2 border-l bg-gray-100 text-gray-500 text-sm">
                Orang
              </span>
            </div>
            {errors.total_employees && (
              <p className="text-red-500 text-sm">
                {errors.total_employees.message}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto bg-purple-600 w-48 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? "Loading..." : "Lanjutkan"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
