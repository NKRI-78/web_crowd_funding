"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  Controller,
  FormProvider,
  useFieldArray,
  useWatch,
  Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import SectionTitle from "./_component/SectionTitle";
import SectionPoint from "./_component/SectionPoint";
import SectionSubtitle from "./_component/SectionSubtitle";
import FileInput from "./_component/FileInput";
import JobStructureForm from "./_component/JobStructureForm";
import AddButton from "./_component/AddButton";
import FormButton from "./_component/FormButton";
import UpdateRing from "./_component/UpdateRing";
import NPWPUploader from "@app/(defaults)/form-penerbit/components/UploadNPWP";

import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import { IFormPublisher } from "@/app/interface/IFormPublisher";
import { getUser } from "@/app/lib/auth";
import { ProfileUpdate } from "@/app/(defaults)/form-penerbit/IUpdateRegistrationKey";

import {
  MAX_DIREKTUR,
  MAX_KOMISARIS,
  FormPenerbitSchema,
  FormPenerbitValues,
} from "./formPenerbit.schema";
import FileUpload from "@/app/helper/FileUpload";
import { sanitizeNPWPOrThrow } from "@/app/lib/npwp-formart";

type Props = {
  onBack: () => void;
  profile: ProfileUpdate | null;
  isUpdate: boolean;
};

const emptyDirektur = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  nama: "",
  jabatan: "direktur" as const,
  noKTP: "",
  fileKTP: "",
  fileNPWP: "",
});

const emptyKomisaris = () => ({
  id: crypto?.randomUUID?.() ?? String(Date.now()),
  nama: "",
  jabatan: "komisaris" as const,
  noKTP: "",
  fileKTP: "",
  fileNPWP: "",
});

const defaultFormValues: FormPenerbitValues = {
  company_nib_path: "",
  akta_pendirian: "",
  sk_kumham_path: "",
  akta_perubahan_terahkir_path: "",
  sk_kumham_terahkir: "",
  fileNpwp: "",
  siup: "",
  tdp: "",
  laporanKeuangan: "",
  rekeningKoran: "",
  // npwp: "",
  direktur: [emptyDirektur()],
  komisaris: [emptyKomisaris()],
  total_employees: "",
  agree: false,
};

const FormPenerbit: React.FC<Props> = ({ onBack, profile, isUpdate }) => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const methods = useForm<FormPenerbitValues>({
    resolver: zodResolver(FormPenerbitSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const clearDraft = () => {
    localStorage.removeItem("publisherDraft");
    localStorage.removeItem("penerbitFormIndex");
    localStorage.removeItem("utusanPenerbitCache");
    localStorage.removeItem("penerbitFormIndex");
    setIsClearing(true);
    reset(defaultFormValues);
    setTimeout(() => setIsClearing(false), 500);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    trigger,
    resetField,
    watch,
  } = methods;

  const direkturFA = useFieldArray({
    control,
    name: "direktur",
    keyName: "_id",
  });
  const komisarisFA = useFieldArray({
    control,
    name: "komisaris",
    keyName: "_id",
  });

  const direkturValues = useWatch({ control, name: "direktur" }) ?? [];
  const komisarisValues = useWatch({ control, name: "komisaris" }) ?? [];

  const hasDirekturUtama = useMemo(
    () => direkturValues.some((d: any) => d.jabatan === "direktur-utama"),
    [direkturValues]
  );
  const hasKomisarisUtama = useMemo(
    () => komisarisValues.some((k: any) => k.jabatan === "komisaris-utama"),
    [komisarisValues]
  );

  useEffect(() => {
    if (isUpdate && profile?.company) {
      const c = profile.company;
      reset({
        laporanKeuangan: c.laporan_keuangan_path ?? "",
        rekeningKoran: c.rekening_koran ?? "",
        direktur: c.directors?.map((d) => ({
          id: String(d.id),
          nama: d.name ?? "",
          jabatan:
            d.position === "Direktur Utama" ? "direktur-utama" : "direktur",
          noKTP: d.ktp ?? "",
          fileKTP: d.ktp_path ?? "",
          fileNPWP: d.npwp_path ?? "",
        })) || [emptyDirektur()],
        komisaris: c.komisaris?.map((k) => ({
          id: String(k.id),
          nama: k.name ?? "",
          jabatan:
            k.position === "Komisaris Utama" ? "komisaris-utama" : "komisaris",
          noKTP: k.ktp ?? "",
          fileKTP: k.ktp_path ?? "",
          fileNPWP: k.npwp_path ?? "",
        })) || [emptyKomisaris()],
        agree: false,
      });
      console.log("Prefilled form from profile (update mode)");
    }
  }, [isUpdate, profile]);

  const submitAdd = async () => {
    try {
      const draft = localStorage.getItem("publisherDraft");
      const userData = getUser();
      if (!draft || !userData) return;

      const draftParsed: IFormPublisher = JSON.parse(draft);

      const payload = {
        role: "2",
        company_name: draftParsed.company_name,
        company_nib: "-",
        company_nib_path: draftParsed.company_nib_path,
        akta_pendirian: draftParsed.akta_pendirian,
        akta_pendirian_path: draftParsed.akta_pendirian,
        akta_perubahan_terahkir: draftParsed.akta_perubahan_terahkir_path,
        akta_perubahan_terahkir_path: draftParsed.akta_perubahan_terahkir_path,
        sk_kumham: draftParsed.sk_kumham_path,
        sk_kumham_path: draftParsed.sk_kumham_path,
        sk_kumham_terahkir: draftParsed.sk_kumham_terahkir,
        // npwp: "-",
        npwp_path: draftParsed.fileNpwp,
        didirikan: draftParsed.establishedYear,
        site: draftParsed.webCompany,
        email: draftParsed.emailCompany,
        phone:
          draftParsed.noPhoneCompany.kode + draftParsed.noPhoneCompany.nomor,
        bank_name: draftParsed.namaBank,
        bank_account: draftParsed.nomorRekening,
        bank_owner: draftParsed.namaPemilik,
        siup: draftParsed.siup,
        tdp: draftParsed.tdp,
        jenis_usaha: draftParsed.jenis_usaha,
        jenis_perusahaan: draftParsed.companyType,
        status_kantor: draftParsed.statusCompanys,
        total_employees: String(draftParsed.total_employees),
        laporan_keuangan_path: draftParsed.laporanKeuangan,
        address: draftParsed.address,
        rekening_koran_path: draftParsed.rekeningKoran,
        directors:
          draftParsed.direktur.length === 1
            ? draftParsed.direktur.map((dir) => ({
                title: "Direktur",
                name: dir.nama,
                position: "Direktur",
                ktp: dir.noKTP,
                ktp_path: dir.fileKTP,
                npwp: "-",
                npwp_path: dir.fileNPWP,
              }))
            : draftParsed.direktur.map((dir) => ({
                title:
                  dir.jabatan === "direktur-utama"
                    ? "Direktur Utama"
                    : "Direktur",
                name: dir.nama,
                position:
                  dir.jabatan === "direktur-utama"
                    ? "Direktur Utama"
                    : "Direktur",
                ktp: dir.noKTP,
                ktp_path: dir.fileKTP,
                npwp: "-",
                npwp_path: dir.fileNPWP,
              })),
        komisaris: draftParsed.komisaris.map((kom) => ({
          title:
            kom.jabatan === "komisaris-utama" ? "Komisaris Utama" : "Komisaris",
          name: kom.nama,
          position:
            kom.jabatan === "komisaris-utama" ? "Komisaris Utama" : "Komisaris",
          ktp: kom.noKTP,
          ktp_path: kom.fileKTP,
          npwp: "-",
          npwp_path: kom.fileNPWP,
        })),
      };

      const res = await axios.post(
        `${API_BACKEND}/api/v1/auth/assign/role`,
        payload,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      console.log(res);

      clearDraft();
      setSubmitted(true);

      await Swal.fire({
        title: "Berhasil",
        text: "Data berhasil dikirim",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      router.push("/dashboard");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Kirim data gagal",
        text:
          error?.response?.data?.message ??
          "Terjadi kesalahan saat mengisi data.",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const getUpdateDocumentValueBasedFormKey = (
    values: FormPenerbitValues
  ): string => {
    if (!profile?.form) return "-";

    let val = "-";

    try {
      // switch (profile.form) {
      //   case "sk-kumham-terakhir":
      //     val = values.sk_kumham_terahkir;
      //     break;
      //   case "siup":
      //     val = values.siup;
      //     break;
      //   case "tdp":
      //     val = values.tdp;
      //     break;
      //   case "nib":
      //     val = values.;
      //     break;
      //   case "sk-kumham-terakhir":
      //     val = pub.sk_kumham_terahkir;
      //     break;
      //   case "jumlah-karyawan":
      //     val = pub.total_employees;
      //     break;
      //   default:
      //     val = "-";
      // }
    } catch {
      val = "-";
    }
    return val;
  };

  const submitUpdate = async (values: FormPenerbitValues) => {
    const isKTP = profile?.form?.endsWith("upload-ktp") ?? false;
    const isNPWP = profile?.form?.endsWith("upload-npwp") ?? false;
    const isSusunanManajemen = isKTP || isNPWP;
    const isDirekturForm = profile?.form?.includes("direktur") ?? false;

    let idManajemen = "-";
    let valManajemen = "-";

    if (isSusunanManajemen) {
      if (isDirekturForm) {
        const idx = Number(profile?.form?.[0] ?? 0);
        const row = values.direktur[idx];
        if (row) {
          idManajemen = row.id ?? String(idx);
          valManajemen = isKTP ? row.fileKTP : row.fileNPWP;
        }
      } else {
        const idx = Number(profile?.form?.[0] ?? 0);
        const row = values.komisaris[idx];
        if (row) {
          idManajemen = row.id ?? String(idx);
          valManajemen = isKTP ? row.fileKTP : row.fileNPWP;
        }
      }
    }

    const payload = {
      ...(profile?.form === "company-profile"
        ? { company_id: profile?.company.id }
        : { project_id: profile?.company.projects?.[0]?.id }),
      val: getUpdateDocumentValueBasedFormKey(values),
      val_array: isSusunanManajemen
        ? [{ id: idManajemen, val: valManajemen, type: isKTP ? "ktp" : "npwp" }]
        : [],
    };

    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) return;
      const userJson = JSON.parse(userCookie);

      await axios.put(
        `${API_BACKEND}/api/v1/document/update/${profile?.form}`,
        payload,
        {
          headers: { Authorization: `Bearer ${userJson.token}` },
        }
      );

      localStorage.removeItem("publisherDraft");
      localStorage.removeItem("utusanPenerbitCache");
      localStorage.removeItem("utusanPenerbitCache");
      localStorage.removeItem("penerbitFormIndex");
      setSubmitted(true);

      await Swal.fire({
        title: "Berhasil",
        text: "Data berhasil diupdate",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Update Gagal",
        text: `${error}`,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (isUpdate) return submitUpdate(values);
    return submitAdd();
  });

  useEffect(() => {
    const draft = localStorage.getItem("publisherDraft");
    if (draft) {
      reset(JSON.parse(draft));
    }
    setIsReady(true);
  }, [reset]);

  const values = watch();
  useEffect(() => {
    if (!isReady || isClearing) return; // 🚩 skip save kalau sedang clear
    const timeout = setTimeout(() => {
      localStorage.setItem("publisherDraft", JSON.stringify(values));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [values, isReady, isClearing]);

  const canAddDirektur = direkturFA.fields.length < MAX_DIREKTUR;
  const canAddKomisaris = komisarisFA.fields.length < MAX_KOMISARIS;

  const { setError, clearErrors } = methods;

  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: Path<FormPenerbitValues>
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

      if (fileUrl) {
        setValue(field, fileUrl, { shouldValidate: true });
      } else {
        alert(`Upload ${field} gagal!`);
      }
    } catch (error) {
      alert(`Upload ${field} error!`);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = raw.replace(/\D/g, "");
    setValue("total_employees", numeric);
  };

  const agree = watch(`agree`);

  return (
    <FormProvider {...methods}>
      <div className="px-6 md:px-24 bg-white">
        <div className="w-full py-28 text-black grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
          <section className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <UpdateRing
                identity={"sk-kumham-terakhir"}
                formKey={profile?.form}
              >
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
              <UpdateRing identity={"npwp"} formKey={profile?.form}>
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

              <UpdateRing
                identity={"sk-kumham-pendirian"}
                formKey={profile?.form}
              >
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

            <div>
              <label className="block mb-1">
                Jumlah Karyawan<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center border rounded overflow-hidden w-80">
                <input
                  {...methods.register("total_employees")}
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

            <div className="flex gap-x-4 items-end mt-3">
              <div className="flex flex-col">
                <SectionTitle text="2. Struktur Permodalan" />
                <div className="my-1" />
                <UpdateRing identity="laporan-keuangan" formKey={profile?.form}>
                  <FileUpload
                    label="Laporan Keuangan"
                    fileUrl={watch("laporanKeuangan")}
                    onUpload={(e) => handleUploadFile(e, "laporanKeuangan")}
                    error={errors?.laporanKeuangan?.message}
                  />
                </UpdateRing>
              </div>

              <div className="flex flex-col">
                <UpdateRing identity="rekening-koran" formKey={profile?.form}>
                  <FileUpload
                    label="Rekening Koran"
                    fileUrl={watch("rekeningKoran")}
                    onUpload={(e) => handleUploadFile(e, "rekeningKoran")}
                    error={errors?.rekeningKoran?.message}
                  />
                </UpdateRing>
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="w-full flex flex-col">
              <SectionTitle text="3. Susunan Manajemen" />
              <SectionPoint text="Direktur" className="mt-2" />

              {direkturFA.fields.map((field, index) => (
                <JobStructureForm
                  key={field._id}
                  namePrefix="direktur"
                  index={index}
                  isKomisaris={false}
                  hasDirekturUtama={hasDirekturUtama}
                  updateFormKey={profile?.form}
                  updateIdentity={`${index}-direktur`}
                  onDelete={() => direkturFA.remove(index)}
                />
              ))}

              <AddButton
                label="+ Tambah Direktur"
                errorText={(errors.direktur?.message as string) || undefined}
                message="Anda hanya dapat menambahkan maksimal 3 Direktur."
                disabled={!canAddDirektur}
                onClick={() => {
                  if (!canAddDirektur) {
                    setError("direktur", {
                      type: "max",
                      message: "Maksimal 3 Direktur",
                    });
                    return;
                  }
                  clearErrors("direktur");
                  direkturFA.append(emptyDirektur());
                }}
              />

              <SectionPoint text="Komisaris" className="mt-2" />

              {komisarisFA.fields.map((field, index) => (
                <JobStructureForm
                  key={field._id}
                  namePrefix="komisaris"
                  index={index}
                  isKomisaris
                  hasKomisarisUtama={hasKomisarisUtama}
                  updateFormKey={profile?.form}
                  updateIdentity={`${index}-komisaris`}
                  onDelete={() => komisarisFA.remove(index)}
                />
              ))}

              <AddButton
                label="+ Tambah Komisaris"
                errorText={(errors.komisaris?.message as string) || undefined}
                message="Anda hanya dapat menambahkan maksimal 3 Komisaris."
                disabled={!canAddKomisaris}
                onClick={() => {
                  if (!canAddKomisaris) {
                    setError("komisaris", {
                      type: "max",
                      message: "Maksimal 3 Komisaris",
                    });
                    return;
                  }
                  clearErrors("komisaris");
                  komisarisFA.append(emptyKomisaris());
                }}
              />
            </div>
            <div className="w-ful flex flex-col mt-4">
              <SectionPoint text="Pernyataan Kebenaran Data" />
              <p className="text-sm text-gray-500 my-2">
                Dengan ini saya menyatakan bahwa seluruh data yang saya berikan
                adalah benar, akurat, dan sesuai dengan kondisi saat ini...
              </p>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...methods.register("agree")}
                  className="form-checkbox"
                />
                <span className="text-sm font-medium text-gray-700">
                  Ya, saya setuju
                </span>
              </label>
              {errors.agree?.message && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.agree.message}
                </p>
              )}
            </div>

            <div className="w-full flex justify-end gap-4 mt-6">
              <FormButton onClick={onBack} type="outlined">
                Kembali
              </FormButton>
              <FormButton
                onClick={onSubmit}
                disabled={!agree}
                className={!agree ? "cursor-not-allowed" : ""}
              >
                {isUpdate ? "Update" : "Kirim"} Data
              </FormButton>
            </div>
          </section>
        </div>
      </div>
    </FormProvider>
  );
};

export default FormPenerbit;
