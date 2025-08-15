"use client";

import { useEffect, useState } from "react";
import { FormPenerbitState, useFormPenerbit } from "./_hooks/useFormPenerbit";

import JobStructureForm from "./_component/JobStructureForm";
import FileInput from "./_component/FileInput";
import SectionTitle from "./_component/SectionTitle";
import SectionPoint from "./_component/SectionPoint";
import SectionSubtitle from "./_component/SectionSubtitle";
import FormButton from "./_component/FormButton";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import AddButton from "./_component/AddButton";
import {
  ProfileUpdate,
  publisherUpdateKeys,
} from "@/app/(defaults)/form-penerbit/UpdateProfileInterface";
import UpdateRing from "./_component/UpdateRing";
import Cookies from "js-cookie";
import { IFormPublisher } from "@/app/interface/IFormPublisher";

type Props = {
  onBack: () => void;
  profile: ProfileUpdate | null;
  isUpdate: boolean;
};

export interface JobStructureError {
  id?: string;
  nama?: string;
  jabatan?: string;
  noKTP?: string;
  fileKTP?: string;
  fileNPWP?: string;
}

export interface FormPenerbitError {
  laporanKeuangan?: string;
  rekeningKoran?: string;
  direktur?: JobStructureError[];
  komisaris?: JobStructureError[];
  direkturErrorText?: string;
  komisarisErrorText?: string;
}

const FormPenerbit: React.FC<Props> = ({ onBack, profile, isUpdate }) => {
  const router = useRouter();

  //* main hooks
  const {
    formState,
    updateField,
    updateDirektur,
    addDirektur,
    removeDirektur,
    updateKomisaris,
    addKomisaris,
    removeKomisaris,
  } = useFormPenerbit();

  //* agree with statement state
  const [agree, setAgree] = useState<boolean>(false);

  //* error state
  const [errors, setErrors] = useState<FormPenerbitError>({});

  //* validate form
  const validateForm = (): boolean => {
    const newErrors: FormPenerbitError = {};

    if (!formState.laporanKeuangan?.trim())
      newErrors.laporanKeuangan = "Laporan Keuangan wajib diisi";
    if (!formState.rekeningKoran?.trim())
      newErrors.rekeningKoran = "Rekening Koran wajib diisi";
    if (formState.direktur?.length === 0)
      newErrors.direkturErrorText = "Direktur wajib ditambahkan";
    if (formState.komisaris?.length === 0)
      newErrors.komisarisErrorText = "Komisaris wajib ditambahkan";
    const direkturError: JobStructureError[] = formState.direktur.map(
      (item) => {
        const jobError: JobStructureError = {};
        if (!item.nama?.trim()) jobError.nama = "Nama wajib diisi";
        if (!item.jabatan?.trim()) jobError.jabatan = "Jabatan wajib diisi";
        if (!item.noKTP?.trim()) jobError.noKTP = "No KTP wajib diisi";
        if (!item.fileKTP?.trim()) jobError.fileKTP = "File KTP wajib diunggah";
        if (!item.fileNPWP?.trim())
          jobError.fileNPWP = "File NPWP wajib diunggah";
        if (item.noKTP.length < 16)
          jobError.noKTP = "No KTP kurang dari 16 digit";
        return jobError;
      }
    );
    const hasDirekturError = direkturError.some(
      (err) => Object.keys(err).length > 0
    );
    if (hasDirekturError) {
      newErrors.direktur = direkturError;
    }

    const komisarisError: JobStructureError[] = formState.komisaris.map(
      (item) => {
        const jobError: JobStructureError = {};
        if (!item.nama?.trim()) jobError.nama = "Nama wajib diisi";
        if (!item.jabatan?.trim()) jobError.jabatan = "Jabatan wajib diisi";
        if (!item.noKTP?.trim()) jobError.noKTP = "No KTP wajib diisi";
        if (!item.fileKTP?.trim()) jobError.fileKTP = "File KTP wajib diunggah";
        if (!item.fileNPWP?.trim())
          jobError.fileNPWP = "File NPWP wajib diunggah";
        if (item.noKTP.length < 16)
          jobError.noKTP = "No KTP kurang dari 16 digit";
        return jobError;
      }
    );
    const hasKomisarisError = komisarisError.some(
      (err) => Object.keys(err).length > 0
    );
    if (hasKomisarisError) {
      newErrors.komisaris = komisarisError;
    }

    setErrors(newErrors);

    const isValid =
      Object.keys(newErrors).length === 0 &&
      !hasDirekturError &&
      !hasKomisarisError;

    if (!isValid) {
      Swal.fire({
        title: "Data Tidak Lengkap / Tidak Valid",
        text: "Beberapa kolom berisi data yang tidak valid atau belum diisi. Harap koreksi sebelum melanjutkan.",
        icon: "warning",
        timer: 10000,
        showConfirmButton: false,
      });
    }

    return isValid;
  };

  //* on submit
  const onSubmit = () => {
    const validForm = validateForm();
    if (!validForm) return;

    if (isUpdate) {
      updateDocument();
    } else {
      addDocument();
    }
  };

  //* load data ketika update dokumen
  useEffect(() => {
    if (isUpdate && profile !== null) {
      const company = profile.company;
      console.log("set data di form-penerbit ketika isUpdate ");
      console.log(company);

      // set data
      updateField("laporanKeuangan", company.laporan_keuangan_path);
      updateField("rekeningKoran", company.rekening_koran);
      for (const direktur of company.directors) {
        const hasName = formState.direktur.some(
          (user) => user.nama === direktur.name
        );
        if (!hasName) {
          addDirektur({
            id: direktur.id.toString(),
            nama: direktur.name,
            jabatan:
              direktur.position == "Direktur Utama"
                ? "direktur-utama"
                : "direktur",
            noKTP: direktur.ktp,
            fileKTP: direktur.ktp_path,
            fileNPWP: direktur.npwp_path,
          });
        }
      }
      for (const komisaris of company.komisaris) {
        const hasName = formState.komisaris.some(
          (user) => user.nama === komisaris.name
        );
        if (!hasName) {
          addKomisaris({
            id: komisaris.id.toString(),
            nama: komisaris.name,
            jabatan:
              komisaris.position == "Komisaris Utama"
                ? "komisaris-utama"
                : "komisaris",
            noKTP: komisaris.ktp,
            fileKTP: komisaris.ktp_path,
            fileNPWP: komisaris.npwp_path,
          });
        }
      }
    }
  }, [profile, isUpdate]);

  //* tambah dokumen
  const addDocument = async () => {
    // hit api
    console.log("Hit API");
    try {
      const draft = localStorage.getItem("publisherDraft");
      const userData = localStorage.getItem("user");
      console.log("Test", draft && userData);
      if (draft && userData) {
        console.log(draft);
        const draftParsed: IFormPublisher = JSON.parse(draft);
        const userParsed = JSON.parse(userData);
        const payload = {
          role: "2",
          company_name: draftParsed.company_name,
          company_nib: "-",
          company_nib_path: draftParsed.company_nib_path,
          akta_pendirian: draftParsed.akta_pendirian,
          akta_pendirian_path: draftParsed.akta_pendirian,
          akta_perubahan_terahkir: draftParsed.akta_perubahan_terahkir_path,
          akta_perubahan_terahkir_path:
            draftParsed.akta_perubahan_terahkir_path,
          sk_kumham: draftParsed.sk_kumham_path,
          sk_kumham_path: draftParsed.sk_kumham_path,
          sk_kumham_terahkir: draftParsed.sk_kumham_terahkir,
          npwp_path: draftParsed.fileNpwp,
          didirkan: draftParsed.establishedYear,
          site: draftParsed.webCompany,
          email: draftParsed.emailCompany,
          phone: draftParsed.noPhoneCompany,
          bank_name: draftParsed.namaBank,
          bank_account: draftParsed.nomorRekening,
          bank_owner: draftParsed.namaPemilik,
          total_employees: draftParsed.total_employees.toString(),
          laporan_keuangan_path: formState.laporanKeuangan,
          address: draftParsed.address,
          rekening_koran_path: formState.rekeningKoran,
          directors:
            formState.direktur.length === 1
              ? formState.direktur.map((dir) => ({
                  title: "Direktur",
                  name: dir.nama,
                  position: "Direktur",
                  ktp: dir.noKTP,
                  ktp_path: dir.fileKTP,
                  npwp: "-",
                  npwp_path: dir.fileNPWP,
                }))
              : formState.direktur.map((dir) => ({
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
          komisaris: formState.komisaris.map((kom) => ({
            title:
              kom.jabatan === "komisaris-utama"
                ? "Komisaris Utama"
                : "Komisaris",
            name: kom.nama,
            position:
              kom.jabatan === "komisaris-utama"
                ? "Komisaris Utama"
                : "Komisaris",
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
            headers: {
              Authorization: `Bearer ${userParsed.token}`,
            },
          }
        );
        console.log(res);

        // Hapus localStorage dan reset
        localStorage.removeItem("formPenerbitDraft");
        localStorage.removeItem("publisherDraft");
        localStorage.removeItem("utusanPenerbitCache");

        await Swal.fire({
          title: "Berhasil",
          text: "Data berhasil dikirim",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        router.push("/");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Kirim data gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengisi data.",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  //* update dokumen
  const updateDocument = async () => {
    const penerbitCache = localStorage.getItem("formPenerbitDraft");
    const isKTP: boolean = profile?.form.endsWith("upload-ktp") ?? false;
    const isNPWP: boolean = profile?.form.endsWith("upload-npwp") ?? false;
    const isSusunanManajemen: boolean = isKTP || isNPWP;
    const isDirektur: boolean = profile?.form.includes("direktur") ?? false;

    if (penerbitCache) {
      const penerbitJSON = JSON.parse(penerbitCache) as FormPenerbitState;
      let idManajemen = "-";
      let valManajemen = "-";

      if (isSusunanManajemen) {
        if (isDirektur) {
          const direkturIndex: number = Number(profile?.form[0]);
          idManajemen = penerbitJSON.direktur[direkturIndex].id;

          if (isKTP) {
            valManajemen = penerbitJSON.direktur[direkturIndex].fileKTP;
          } else {
            valManajemen = penerbitJSON.direktur[direkturIndex].fileNPWP;
          }
        } else {
          const komisarisIndex: number = Number(profile?.form[0]);
          idManajemen = penerbitJSON.komisaris[komisarisIndex].id;

          if (isKTP) {
            valManajemen = penerbitJSON.komisaris[komisarisIndex].fileKTP;
          } else {
            valManajemen = penerbitJSON.komisaris[komisarisIndex].fileNPWP;
          }
        }
      }

      const payload = {
        ...(profile?.form === "company-profile"
          ? { company_id: profile?.company.id }
          : { project_id: profile?.company.projects?.[0]?.id }),
        val: getUpdateDocumentValueBasedFormKey(penerbitJSON),
        val_array: isSusunanManajemen
          ? [
              {
                id: idManajemen,
                val: valManajemen,
                type: isKTP ? "ktp" : "npwp",
              },
            ]
          : [],
      };

      try {
        const userCookie = Cookies.get("user");
        if (!userCookie) return null;
        const userJson = JSON.parse(userCookie);

        const result = await axios.put(
          `${API_BACKEND}/api/v1/document/update/${profile?.form}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${userJson.token}`,
            },
          }
        );

        console.log("Payload ", payload);
        console.log("Result ", payload);

        // Hapus localStorage dan reset
        localStorage.removeItem("formPenerbitDraft");
        localStorage.removeItem("publisherDraft");

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
    }
  };

  useEffect(() => {
    if (!isUpdate) {
      window.scroll(0, 0);
    }
  }, [isUpdate]);

  const getUpdateDocumentValueBasedFormKey = (
    penerbitJSON: FormPenerbitState
  ): string => {
    if (!profile?.form) return "-";

    let val: string = "";

    const isFormPunyanyaUdin = publisherUpdateKeys.includes(profile?.form);
    try {
      if (isFormPunyanyaUdin) {
        const publisherCache = localStorage.getItem("publisherDraft");
        if (publisherCache) {
          const publisherJSON = JSON.parse(publisherCache);
          switch (profile.form) {
            case "nib":
              val = publisherJSON.company_nib_path;
              break;
            case "akta-pendirian-perusahaan":
              val = publisherJSON.akta_pendirian;
              break;
            case "sk-kumham-path":
              val = publisherJSON.sk_kumham_path;
              break;
            case "akta-perubahan-terakhir":
              val = publisherJSON.akta_perubahan_terahkir_path;
              break;
            case "sk-kumham-terakhir":
              val = publisherJSON.sk_kumham_terahkir;
              break;
            case "jumlah-karyawan":
              val = publisherJSON.total_employees;
              break;
            default:
              val = "-";
              break;
          }
        }
      } else {
        switch (profile.form) {
          case "laporan-keuangan":
            val = penerbitJSON.laporanKeuangan;
            break;
          case "rekening-koran":
            val = penerbitJSON.rekeningKoran;
            break;
          default:
            val = "-";
            break;
        }
      }
    } catch (_) {
      val = "-";
    }

    console.log("profile.form: ", profile?.form);
    console.log("form val ? = " + val);
    console.log(penerbitJSON.rekeningKoran);

    return val;
  };

  return (
    <div className="px-6 md:px-24 bg-white">
      <div className="w-full py-28 text-black grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
        {/* === left section === */}
        <section className="w-full">
          {/* 2. Struktur Permodalan */}
          <div className="flex gap-x-4 items-end">
            <div className="flex flex-col">
              <SectionTitle text="2. Struktur Permodalan" />
              <div className="my-1"></div>
              <UpdateRing identity="laporan-keuangan" formKey={profile?.form}>
                <SectionPoint text="Laporan Keuangan" />
                <SectionSubtitle
                  text="File maksimal berukuran 10mb"
                  className="my-1"
                />

                <FileInput
                  fileName="Laporan Keuangan"
                  fileUrl={formState.laporanKeuangan}
                  accept=".pdf,.xlsx,.xlsm,.xls,.xltx,.xltm,.xlsb"
                  onChange={(fileUrl) => {
                    updateField("laporanKeuangan", fileUrl);
                    if (fileUrl) {
                      setErrors({ ...errors, laporanKeuangan: "" });
                    }
                  }}
                  errorText={errors.laporanKeuangan}
                />
              </UpdateRing>
            </div>

            <div className="flex flex-col">
              <UpdateRing identity="rekening-koran" formKey={profile?.form}>
                <SectionPoint text="Rekening Koran" />
                <SectionSubtitle
                  text="File maksimal berukuran 10mb"
                  className="my-1"
                />

                <FileInput
                  fileName="Rekening Koran"
                  fileUrl={formState.rekeningKoran}
                  accept=".pdf,.xlsx,.xlsm,.xls,.xltx,.xltm,.xlsb"
                  onChange={(fileUrl) => {
                    updateField("rekeningKoran", fileUrl);
                    if (fileUrl) {
                      setErrors({ ...errors, rekeningKoran: "" });
                    }
                  }}
                  errorText={errors.rekeningKoran}
                />
              </UpdateRing>
            </div>
          </div>

          {/* 3. Susunan Manajemen */}
          <div className="w-full flex flex-col mt-6">
            <SectionTitle text="3. Susunan Manajemen" />

            <SectionPoint text="Direktur" className="mt-2" />

            {formState.direktur.map((structure, index) => {
              const hasDirekturUtama = formState.direktur.some(
                (item) =>
                  item.jabatan === "direktur-utama" && item.id !== structure.id
              );

              return (
                <JobStructureForm
                  key={structure.id}
                  data={structure}
                  hasDirekturUtama={hasDirekturUtama}
                  updateFormKey={profile?.form}
                  updateIdentity={`${index}-direktur`}
                  onChange={(fieldKey, value) => {
                    updateDirektur(structure.id, fieldKey, value);

                    const currentErrors = errors.direktur ?? [];
                    const updatedErrors = [...currentErrors];

                    const existingError = updatedErrors[index] ?? {};
                    delete existingError[fieldKey];
                    updatedErrors[index] = existingError;

                    setErrors({
                      ...errors,
                      direktur: updatedErrors,
                    });
                  }}
                  errors={errors.direktur?.[index]}
                  onDelete={() => {
                    removeDirektur(structure.id);
                    setErrors({
                      ...errors,
                      direktur: [],
                    });
                  }}
                />
              );
            })}

            <AddButton
              label="+ Tambah Direktur"
              errorText={errors.direkturErrorText}
              message="Anda hanya dapat menambahkan maksimal 3 Direktur."
              onClick={() => {
                if (formState.direktur.length === 0) {
                  setErrors({ ...errors, direkturErrorText: "" });
                }
                addDirektur();
              }}
            />

            <SectionPoint text="Komisaris" className="mt-2" />

            {formState.komisaris.map((structure, index) => {
              const hasKomisarisUtama = formState.komisaris.some(
                (item) =>
                  item.jabatan === "komisaris-utama" && item.id !== structure.id
              );
              return (
                <JobStructureForm
                  key={structure.id}
                  isKomisaris={true}
                  data={structure}
                  hasKomisarisUtama={hasKomisarisUtama}
                  updateFormKey={profile?.form}
                  updateIdentity={`${index}-komisaris`}
                  onChange={(fieldKey, value) => {
                    updateKomisaris(structure.id, fieldKey, value);

                    const currentErrors = errors.direktur ?? [];
                    const updatedErrors = [...currentErrors];

                    const existingError = updatedErrors[index] ?? {};
                    delete existingError[fieldKey];
                    updatedErrors[index] = existingError;

                    setErrors({
                      ...errors,
                      komisaris: updatedErrors,
                    });
                  }}
                  errors={errors.komisaris?.[index]}
                  onDelete={() => {
                    removeKomisaris(structure.id);
                    setErrors({
                      ...errors,
                      komisaris: [],
                    });
                  }}
                />
              );
            })}

            <AddButton
              label="+ Tambah Komisaris"
              errorText={errors.komisarisErrorText}
              message="Anda hanya dapat menambahkan maksimal 3 Komisaris."
              onClick={() => {
                if (formState.komisaris.length === 0) {
                  setErrors({ ...errors, komisarisErrorText: "" });
                }
                addKomisaris();
              }}
            />
          </div>
        </section>

        {/* === right section === */}
        <section className="w-full">
          <div className="w-ful flex flex-col mt-4">
            <SectionPoint text="Pernyataan Kebenaran Data" />
            <p className="text-sm text-gray-500 my-2">
              Dengan ini saya menyatakan bahwa seluruh data yang saya berikan
              adalah benar, akurat, dan sesuai dengan kondisi saat ini. Saya
              bertanggung jawab penuh atas data yang diinput dan memahami bahwa
              ketidaksesuaian informasi dapat berdampak pada proses investasi.
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="setujuKebenaranData"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                }}
                className="form-checkbox"
              />
              <span className="text-sm font-medium text-gray-700">
                Ya, saya setuju
              </span>
            </label>

            {!agree && (
              <p className="text-red-500 text-xs mt-2">
                Silakan centang kotak persetujuan untuk melanjutkan.
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
  );
};

export default FormPenerbit;
