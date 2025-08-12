"use client";

import {
  Controller,
  FormProvider,
  Resolver,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "@/app/helper/FileUpload";
import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import { fetchProvinces } from "@/app/lib/fetchWilayah";
import FormAlamat from "./FormAlamat";
import Swal from "sweetalert2";
import Select from "react-select";
import { ProfileUpdate } from "./UpdateProfileInterface";
import UpdateRing from "@/app/components/inputFormPenerbit/_component/UpdateRing";
import NPWPUploader from "./components/UploadNPWP";
import { JENIS_USAHA_OPTIONS } from "@/app/utils/jenisUsaha";
import RHFSelect from "./components/TypeBussiness";
import RHFSelectGeneric from "./components/RHFSelectGeneric";
import { fetchJenisUsaha, TypeOption } from "@/app/utils/fetchJenisUsaha";

export const alamatSchema = z.object({
  name: z.string().optional(),
  province_name: z.string(),
  city_name: z.string().min(1, "Kota wajib diisi"),
  district_name: z.string().min(1, "Kecamatan wajib diisi"),
  subdistrict_name: z.string().min(1, "Kelurahan wajib diisi"),
  postal_code: z.string().min(1, "Kode pos wajib diisi"),
  detail: z.string().min(1, "Detail alamat wajib diisi"),
});

type OptionCompanyType = { label: string; value: string };

const optionsCompanyType: OptionCompanyType[] = [
  { label: "UMKM", value: "UMKM" },
  { label: "Enterprise", value: "Enterprise" },
];

const optionValues = optionsCompanyType.map((o) => o.value);

const statusCompanyType: OptionCompanyType[] = [
  { label: "SEWA", value: "SEWA" },
  { label: "MILIK SENDIRI", value: "MILIK SENDIRI" },
];

const statusCompany = statusCompanyType.map((o) => o.value);

export const schema = z
  .object({
    company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
    jenis_usaha: z.string().min(1, "Jenis usaha wajib dipilih"),
    address: z
      .array(alamatSchema)
      .min(1, "Minimal 1 alamat harus diisi")
      .max(2, "Maksimal hanya 2 alamat"),
    sameAsCompany: z.boolean().optional(),
    detailKorespondensi: z.string().optional(),
    total_employees: z
      .string()
      .min(1, "Jumlah karyawan wajib diisi")
      .refine((val) => Number(val) >= 1, {
        message: "Jumlah karyawan minimal 1 orang",
      }),
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
    siup: z
      .string()
      .min(1, { message: "Surat Izin Usaha Perdagangan wajib diunggah" }),
    tdp: z
      .string()
      .min(1, { message: "Tanda Daftar Perusahaan wajib diunggah" }),
    fileNpwp: z.string().min(1, { message: "NPWP wajib diunggah" }),
    namaBank: z.string().min(1, "Nama bank wajib dipilih"),
    nomorRekening: z
      .string()
      .trim()
      .min(1, "Nomor rekening wajib diisi")
      .regex(/^\d+$/, "Hanya angka"),
    namaPemilik: z.string().trim().min(1, "Nama pemilik wajib diisi"),
    noPhoneCompany: z
      .string()
      .trim()
      .min(1, "Nomor Telepon Perusahaan wajib diisi"),
    webCompany: z
      .string()
      .trim()
      .min(1, "Situs Perusahaan wajib diisi")
      .url("Format URL tidak valid (contoh: https://example.com)"),
    emailCompany: z
      .string()
      .trim()
      .min(1, "Email Perusahaan wajib diisi")
      .email("Format email tidak valid"),
    companyType: z
      .string()
      .min(1, "Tipe Perusahaan wajib dipilih")
      .refine((v) => optionValues.includes(v), "Tipe tidak valid"),
    statusCompanys: z
      .string()
      .min(1, "Tipe Status Kantor/Tempat Usaha wajib dipilih")
      .refine((v) => statusCompany.includes(v), "Tipe tidak valid"),
    establishedYear: z
      .string()
      .min(1, "Tahun berdiri wajib dipilih")
      .refine(
        (v) =>
          /^\d{4}$/.test(v) && +v >= 1950 && +v <= new Date().getFullYear(),
        "Tahun tidak valid"
      ),
  })
  .superRefine((data, ctx) => {
    if (data.namaPemilik !== data.company_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["namaPemilik"],
        message: "Nama pemilik harus sama dengan nama perusahaan",
      });
    }
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
      value: item.name,
      label: item.name,
      zip_code: item.zip_code,
    }));
  } catch (error) {
    console.error("Failed to fetch options:", error);
    return [];
  }
};

type OptionType = { value: string; label: string; zip_code: string };
type BankOption = { value: string; label: string };

type Props = {
  onNext: () => void;
  profile: ProfileUpdate | null;
  isUpdate: boolean;
};

export default function PublisherForm({ onNext, profile, isUpdate }: Props) {
  const [isReady, setIsReady] = useState(false);

  const [provinsiList, setProvinsiList] = useState<OptionType[]>([]);
  const [kotaList, setKotaList] = useState<Record<number, OptionType[]>>({});
  const [optionsBussines, setOptionsBussines] = useState<TypeOption[]>([]);
  const [kecamatanList, setKecamatanList] = useState<
    Record<number, OptionType[]>
  >({});
  const [kelurahanList, setKelurahanList] = useState<
    Record<number, OptionType[]>
  >({});

  const [bank, setBank] = useState<Array<{ code: string; name: string }>>([]);

  const bankOptions: BankOption[] = bank.map((b) => ({
    value: b.name,
    label: b.name,
  }));

  useEffect(() => {
    fetchJenisUsaha()
      .then(setOptionsBussines)
      .catch((err) => console.error(err));
  }, []);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    mode: "onBlur",
    defaultValues: {
      sameAsCompany: false,
      total_employees: "",
      jenis_usaha: "",
      company_nib_path: "",
      akta_pendirian: "",
      sk_kumham_path: "",
      akta_perubahan_terahkir_path: "",
      sk_kumham_terahkir: "",
      fileNpwp: "",
      siup: "",
      tdp: "",
      noPhoneCompany: "",
      webCompany: "",
      emailCompany: "",
      namaBank: "",
      nomorRekening: "",
      namaPemilik: "",
      companyType: undefined,
      statusCompanys: undefined,
      establishedYear: "",
      address: [
        {
          name: "Company",
          province_name: "",
          city_name: "",
          district_name: "",
          subdistrict_name: "",
          postal_code: "",
          detail: "",
        },
        {
          name: "Koresponden",
          province_name: "",
          city_name: "",
          district_name: "",
          subdistrict_name: "",
          postal_code: "",
          detail: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({ control, name: "address" });

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
        `${API_BACKEND_MEDIA}/api/v1/media/upload`,
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
        siup: "Upload Surat Izin Usaha Perdagangan berhasil!",
        tdp: "Upload Tanda Daftar Perusahaan berhasil!",
        fileNpwp: "Upload NPWP berhasil!",
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

  useEffect(() => {
    if (isUpdate && profile !== null) {
      setValue("company_name", profile?.company.name ?? "-");
      setValue("company_nib_path", profile?.company.nib_path ?? "-");
      setValue("akta_pendirian", profile?.company.akta_pendirian ?? "-");
      setValue("sk_kumham_path", profile?.company.sk_kumham_path ?? "-");
      setValue("total_employees", profile?.company.total_employees.toString());
      setValue(
        "akta_perubahan_terahkir_path",
        profile?.company.akta_perubahan_terahkir ?? "-"
      );
      setValue(
        "sk_kumham_terahkir",
        profile?.company.sk_kumham_terahkir ?? "-"
      );
      if (profile?.company.address) {
        const mappedAddress = profile.company.address.map((addr) => ({
          province_name: addr.province_name ?? "",
          city_name: addr.city_name ?? "",
          district_name: addr.district_name ?? "",
          subdistrict_name: addr.subdistrict_name ?? "",
          postal_code: addr.postal_code ?? "",
          detail: addr.detail ?? "",
          name: addr.name ?? "",
        }));

        console.log("Address ", mappedAddress);

        setValue("address", mappedAddress);
      }
    }
  }, [isUpdate, profile]);

  function isEmptyAddress(a: any = {}) {
    return [
      "province_name",
      "city_name",
      "district_name",
      "subdistrict_name",
      "postal_code",
      "detail",
    ].every((k) => !a?.[k]);
  }

  function isSameAddress(a: any = {}, b: any = {}) {
    if (isEmptyAddress(a) || isEmptyAddress(b)) return false;

    return [
      "province_name",
      "city_name",
      "district_name",
      "subdistrict_name",
      "postal_code",
      "detail",
    ].every((k) => (a?.[k] || "") === (b?.[k] || ""));
  }

  const alamatPerusahaan = useWatch({
    control,
    name: "address.0",
  });

  const alamatKoresponden = useWatch({
    control,
    name: "address.1",
  });

  const sameAsCompany = useWatch({
    control,
    name: "sameAsCompany",
  });

  useEffect(() => {
    const sama = isSameAddress(alamatPerusahaan, alamatKoresponden);

    if (sama && !sameAsCompany) {
      setValue("sameAsCompany", true, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }

    if (!sama && sameAsCompany) {
      setValue("sameAsCompany", false, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [alamatPerusahaan, alamatKoresponden]);

  useEffect(() => {
    if (!sameAsCompany) return;

    setValue(
      "address.1",
      {
        ...alamatPerusahaan,
        name: "Koresponden",
      },
      {
        shouldValidate: false,
        shouldDirty: true,
      }
    );
  }, [alamatPerusahaan, sameAsCompany, setValue]);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const response = await axios.get(
          `https://api.gateway.langitdigital78.com/v1/bank`
        );
        setBank(response.data.data.beneficiary_banks);
      } catch (error) {
        console.error("Gagal ambil bank:", error);
      }
    };

    fetchBank();
  }, []);

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
    }, 1000);

    return () => clearTimeout(timeout);
  }, [values, isReady]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Data, ", data);
      onNext();
    } catch (err) {
      console.error(err);
      alert("Gagal submit");
    }
  };

  if (!isReady) {
    return <p>Loading...</p>;
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
    setValue("total_employees", numeric);
  };

  const onlyDigits: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue("nomorRekening", e.target.value.replace(/\D/g, ""), {
      shouldValidate: true,
    });
  };
  const phoneNumber: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue("noPhoneCompany", e.target.value.replace(/\D/g, "").slice(0, 13), {
      shouldValidate: true,
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });

  return (
    <section className="bg-white text-black items-center px-3 md:px-10 py-20 md:py-30">
      <form
        onSubmit={handleSubmit(onSubmit, showErrorToasts)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto"
      >
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
              placeholder="Masukkan Nama Perusahaan"
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm">
                {errors.company_name.message}
              </p>
            )}
          </div>
          <label className="block font-medium">
            Tahun Berdiri <span className="text-red-500">*</span>
          </label>
          <RHFSelectGeneric<FormData, "establishedYear">
            name="establishedYear"
            control={control}
            options={yearOptions}
          />
          {errors.establishedYear && (
            <p className="text-sm text-red-600">
              {errors.establishedYear.message}
            </p>
          )}
          <RHFSelect<FormData, "jenis_usaha">
            name="jenis_usaha"
            control={control}
            options={optionsBussines}
          />

          <label className="block font-medium">
            Tipe Perusahaan <span className="text-red-500">*</span>
          </label>
          <RHFSelectGeneric<FormData, "companyType">
            name="companyType"
            control={control}
            options={optionsCompanyType}
          />
          {errors.companyType && (
            <p className="text-sm text-red-600">{errors.companyType.message}</p>
          )}

          <label className="block font-medium">
            Status Kantor/Tempat Usaha <span className="text-red-500">*</span>
          </label>
          <RHFSelectGeneric<FormData, "statusCompanys">
            name="statusCompanys"
            control={control}
            options={statusCompanyType}
          />
          {errors.statusCompanys && (
            <p className="text-sm text-red-600">
              {errors.statusCompanys.message}
            </p>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nomor Telepon Perusahaan{" "}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("noPhoneCompany")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={phoneNumber}
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Nomor Telepon Perusahaan"
            />
            {errors.noPhoneCompany && (
              <p className="text-red-500 text-sm mt-1">
                {errors.noPhoneCompany.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Situs Perusahaan <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("webCompany")}
              type="text"
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Situs Perusahaan"
            />
            {errors.webCompany && (
              <p className="text-red-500 text-sm mt-1">
                {errors.webCompany.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Email Perusahaan <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("emailCompany")}
              type="text"
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Email Perusahaan"
            />
            {errors.emailCompany && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailCompany.message}
              </p>
            )}
          </div>

          <UpdateRing identity={"fileNpwp"} formKey={profile?.form}>
            <FileUpload
              label="NPWP"
              fileUrl={watch("fileNpwp")}
              onUpload={(e) => handleUploadFile(e, "fileNpwp")}
              error={errors?.fileNpwp?.message}
            />
          </UpdateRing>

          <UpdateRing identity={"nib"} formKey={profile?.form}>
            <FileUpload
              label="Nomor Induk Berusaha (NIB)"
              fileUrl={watch("company_nib_path")}
              onUpload={(e) => handleUploadFile(e, "company_nib_path")}
              error={errors?.company_nib_path?.message}
            />
          </UpdateRing>

          <UpdateRing
            identity={"akta-pendirian-perusahaan"}
            formKey={profile?.form}
          >
            <FileUpload
              label="Akte Pendirian Perusahaan"
              fileUrl={watch("akta_pendirian")}
              onUpload={(e) => handleUploadFile(e, "akta_pendirian")}
              error={errors?.akta_pendirian?.message}
            />
          </UpdateRing>

          <UpdateRing identity={"sk-kumham-path"} formKey={profile?.form}>
            <FileUpload
              label="SK Kumham Pendirian"
              fileUrl={watch("sk_kumham_path")}
              onUpload={(e) => handleUploadFile(e, "sk_kumham_path")}
              error={errors?.sk_kumham_path?.message}
            />
          </UpdateRing>

          <UpdateRing
            identity={"akta-perubahan-terakhir"}
            formKey={profile?.form}
          >
            <FileUpload
              label="Akte Perubahan Terakhir"
              fileUrl={watch("akta_perubahan_terahkir_path")}
              onUpload={(e) =>
                handleUploadFile(e, "akta_perubahan_terahkir_path")
              }
              error={errors?.akta_perubahan_terahkir_path?.message}
            />
          </UpdateRing>
        </div>

        <div className="space-y-4">
          <UpdateRing identity={"sk-kumham-terakhir"} formKey={profile?.form}>
            <FileUpload
              label="SK Kumham Terakhir"
              fileUrl={watch("sk_kumham_terahkir")}
              onUpload={(e) => handleUploadFile(e, "sk_kumham_terahkir")}
              error={errors?.sk_kumham_terahkir?.message}
            />
          </UpdateRing>
          <UpdateRing identity={"siup"} formKey={profile?.form}>
            <FileUpload
              label="Surat Izin Usaha Perdagangan (SIUP)"
              fileUrl={watch("siup")}
              onUpload={(e) => handleUploadFile(e, "siup")}
              error={errors?.siup?.message}
            />
          </UpdateRing>
          <UpdateRing identity={"tdp"} formKey={profile?.form}>
            <FileUpload
              label="Tanda Daftar Perusahaan (TDP)"
              fileUrl={watch("tdp")}
              onUpload={(e) => handleUploadFile(e, "tdp")}
              error={errors?.tdp?.message}
            />
          </UpdateRing>
          {/* <NPWPUploader /> */}
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
            <label className="block font-medium">
              Nama Bank <span className="text-red-500">*</span>
            </label>
            <RHFSelectGeneric<FormData, "namaBank">
              name="namaBank"
              control={control}
              options={bankOptions}
            />
            {errors.namaBank && (
              <p className="text-sm text-red-600">{errors.namaBank.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nomor Rekening Perusahaan{" "}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("nomorRekening")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={onlyDigits}
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Nomor Rekening"
            />
            {errors.nomorRekening && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nomorRekening.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nama Rekening <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("namaPemilik")}
              className="border rounded p-2 w-full placeholder:text-sm"
              placeholder="Masukkan Nama Pemilik Rekening"
            />
            {errors.namaPemilik && (
              <p className="text-red-500 text-sm mt-1">
                {errors.namaPemilik.message}
              </p>
            )}
          </div>

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
              className="ml-auto px-6 py-2 rounded-md font-semibold text-sm transition-all duration-200 active:scale-[0.98] bg-[#3C2B90] text-white hover:bg-[#2e2176] disabled:opacity-50 disabled:cursor-not-allowed "
            >
              {isSubmitting ? "Loading..." : "Lanjutkan"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
