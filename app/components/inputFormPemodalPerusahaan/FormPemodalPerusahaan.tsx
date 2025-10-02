"use client";

import FileInput from "@/app/components/inputFormPemodalPerusahaan/component/FileInput";
import FormButton from "@/app/components/inputFormPemodalPerusahaan/component/FormButton";
import SectionPoint from "@/app/components/inputFormPemodalPerusahaan/component/SectionPoint";
import Subtitle from "@/app/components/inputFormPemodalPerusahaan/component/SectionSubtitle";
import TextField from "@/app/components/inputFormPemodalPerusahaan/component/TextField";
import ContainerSelfie from "./component/ContainerSelfie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/helper/cookie";
import { getUser } from "@/app/lib/auth";

interface FormSchema {
  photo: File | null;
  fullname: string;
  jabatan: string;
  fileKtp: string;
  noKtp: string;
  noNpwp: string;
  noNpwpFormatted?: string;
  suratKuasa: string;
}

interface ErrorSchema {
  photo?: string;
  fullname?: string;
  jabatan?: string;
  fileKtp?: string;
  noKtp?: string;
  noNpwp?: string;
  noNpwpFormatted?: string;
  suratKuasa?: string;
}

const FormPemodalPerusahaan: React.FC = () => {
  const [formFields, setFormFields] = useState<FormSchema>({
    photo: null,
    fullname: "",
    jabatan: "",
    fileKtp: "",
    noKtp: "",
    noNpwp: "",
    noNpwpFormatted: "",
    suratKuasa: "",
  });

  const [errors, setErrors] = useState<ErrorSchema>({});
  const [user, setUser] = useState<AuthDataResponse | null>(null);
  const router = useRouter();

  //* load profile
  useEffect(() => {
    const userCookie = getUser();
    if (userCookie) {
      setUser(userCookie);

      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${API_BACKEND}/api/v1/profile`, {
            headers: {
              Authorization: `Bearer ${userCookie.token}`,
            },
          });

          const profile = res.data?.data;
          if (profile?.fullname) {
            setFormFields((prev) => ({
              ...prev,
              fullname: profile.fullname,
            }));
          }
        } catch (error: any) {
          console.error("Gagal fetch profile:", error.response?.data || error);
        }
      };

      fetchProfile();
    }
  }, []);

  //* handle submit
  const handleSubmit = async () => {
    console.log("Form data saat klik Lanjutkan:", formFields);

    const isValid = validateForm();
    if (isValid) {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const userParsed = JSON.parse(userData);
          const urlPhotoSelfie = await uploadFotoSelfie(formFields.photo!);

          const payload = {
            fullname: formFields.fullname,
            photo_selfie: urlPhotoSelfie,
            jabatan: formFields.jabatan,
            photo_ktp: formFields.fileKtp,
            no_ktp: formFields.noKtp,
            no_npwp: formFields.noNpwp,
            surat_kuasa: formFields.suratKuasa,
          };

          console.log("Role user:", userParsed?.role);

          await axios.post(
            `${API_BACKEND}/api/v1/auth/register-as-emiten`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${userParsed.token}`,
              },
            }
          );

          setCookie(
            "user",
            JSON.stringify({
              ...user,
              role: "investor institusi",
            } as AuthDataResponse)
          );

          await Swal.fire({
            icon: "success",
            title: "Data berhasil dikirim",
            text: "Data Anda telah tersimpan. Silakan lanjutkan untuk mengisi form berikutnya.",
            timer: 3000,
            timerProgressBar: true,
          });

          localStorage.removeItem("pemodalPerusahaanCache");
          router.push("/form-data-pemodal-perusahaan");
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
    }
  };

  //* load cache
  useEffect(() => {
    const formCache = localStorage.getItem("pemodalPerusahaanCache");
    if (formCache) {
      const {
        photo,
        fullname,
        jabatan,
        noKtp,
        noNpwp,
        noNpwpFormatted,
        suratKuasa,
        fileKtp,
      } = JSON.parse(formCache) as FormSchema;
      setFormFields({
        photo: photo,
        fullname: fullname,
        jabatan: jabatan,
        noKtp: noKtp,
        noNpwp: noNpwp,
        noNpwpFormatted: noNpwpFormatted,
        suratKuasa: suratKuasa,
        fileKtp: fileKtp,
      });
    }
  }, []);

  //* set cache
  useEffect(() => {
    localStorage.setItem("pemodalPerusahaanCache", JSON.stringify(formFields));
  }, [formFields]);

  //* validate form
  const validateForm = (): boolean => {
    const newErrors: ErrorSchema = {};

    if (!formFields.photo) {
      newErrors.photo = "Anda belum mengambil foto";
    }
    if (!formFields.fullname) {
      newErrors.fullname = "Nama Lengkap tidak boleh kosong";
    }
    if (!formFields.jabatan) {
      newErrors.jabatan = "Jabatan tidak boleh kosong";
    }
    if (!formFields.noKtp) {
      newErrors.noKtp = "No KTP tidak boleh kosong";
    } else if (formFields.noKtp.length < 16) {
      newErrors.noKtp = "No KTP kurang dari 16 digit";
    }
    if (!formFields.noNpwp) {
      newErrors.noNpwp = "No NPWP tidak boleh kosong";
    } else if (formFields.noNpwp.length < 15) {
      newErrors.noNpwp = "No NPWP kurang dari 15 digit";
    } else if (formFields.noNpwp.length > 15) {
      newErrors.noNpwp = "No NPWP lebih dari 15 digit";
    }

    if (!formFields.suratKuasa) {
      newErrors.suratKuasa = "Surat Kuasa wajib disertakan";
    }
    if (!formFields.fileKtp) {
      newErrors.fileKtp = "File KTP wajib disertakan";
    }

    setErrors(newErrors);

    console.log(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

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

  //* upload foto selfie
  const uploadFotoSelfie = async (photo: File): Promise<string> => {
    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", "Foto-Selfie");
    formData.append("media", photo!);

    try {
      const res = await axios.post(
        `${API_BACKEND_MEDIA}/api/v1/media/upload`,
        formData
      );
      return res.data?.data?.path ?? "";
    } catch (error) {
      return "-";
    }
  };

  return (
    <div className="w-full py-28 mx-auto px-11 md:px-16 lg:px-52 bg-white">
      <h1 className="text-black text-2xl font-bold">Form Pemodal Perusahaan</h1>

      <div className="my-2"></div>

      <p className="text-gray-500 text-sm">
        Halaman ini digunakan untuk mengisi dan mengunggah informasi identitas
        resmi perusahaan Anda sebagai pemodal. Lengkapi seluruh data dengan
        benar untuk memastikan proses verifikasi berjalan lancar dan investasi
        dapat segera dilakukan.
      </p>

      <div className="my-5"></div>

      <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-6">
        {/* conteiner foto selfie */}
        <ContainerSelfie
          photoResult={(photoSelfie) => {
            setFormFields({ ...formFields, photo: photoSelfie });
            if (photoSelfie) {
              setErrors({ ...errors, photo: "" });
            }
          }}
          errorText={errors.photo}
        />

        {/* input data */}
        <div className="w-full text-black">
          <SectionPoint text="Nama Lengkap" className="my-1" />
          <TextField
            placeholder="Nama Lengkap"
            value={formFields.fullname}
            onChange={() => {}}
            disabled
            errorText={errors.fullname}
          />

          <div className="my-3"></div>

          <SectionPoint text="Jabatan" className="mb-1" />
          <TextField
            placeholder="Jabatan"
            value={formFields.jabatan}
            onChange={(val) => {
              setFormFields({ ...formFields, jabatan: val.target.value });
              if (val) {
                setErrors({ ...errors, jabatan: "" });
              }
            }}
            errorText={errors.jabatan}
          />

          <div className="my-3"></div>

          <SectionPoint text="Nomor KTP" className="mb-1" />
          <TextField
            placeholder="Nomor KTP"
            type="number"
            maxLength={16}
            value={formFields.noKtp}
            onChange={(val) => {
              setFormFields({ ...formFields, noKtp: val.target.value });
              if (val) {
                setErrors({ ...errors, noKtp: "" });
              }
            }}
            errorText={errors.noKtp}
          />
          <div className="my-1"></div>
          <p className="text-[11px] text-gray-500">
            Nomor KTP harus memuat 16 digit angka.
          </p>

          <div className="my-3"></div>

          <SectionPoint text="Nomor NPWP" className="mb-1" />
          <TextField
            placeholder="Nomor NPWP"
            type="text"
            value={formFields.noNpwpFormatted || ""}
            onChange={(val) => {
              const rawValue = val.target.value.replace(/\D/g, "");
              let formattedValue = rawValue;

              if (rawValue.length > 2) {
                formattedValue = rawValue.slice(0, 2) + "." + rawValue.slice(2);
              }
              if (rawValue.length > 5) {
                formattedValue =
                  formattedValue.slice(0, 6) + "." + formattedValue.slice(6);
              }
              if (rawValue.length > 8) {
                formattedValue =
                  formattedValue.slice(0, 10) + "." + formattedValue.slice(10);
              }
              if (rawValue.length > 9) {
                formattedValue =
                  formattedValue.slice(0, 12) + "-" + formattedValue.slice(12);
              }
              if (rawValue.length > 12) {
                formattedValue =
                  formattedValue.slice(0, 16) + "." + formattedValue.slice(16);
              }

              setFormFields({
                ...formFields,
                noNpwp: rawValue, // simpan tanpa format
                noNpwpFormatted: formattedValue,
              });

              if (rawValue.length === 15) {
                setErrors({ ...errors, noNpwp: "" });
              }
            }}
            maxLength={20}
            errorText={errors.noNpwp}
          />

          <div className="my-1"></div>
          <p className="text-[11px] text-gray-500">
            Nomor NPWP harus sesuai dengan format.
          </p>

          <div className="my-6"></div>

          <div className="w-full flex gap-6 ">
            <div>
              <SectionPoint text="Surat Kuasa" />
              <Subtitle text="File maksimal berukuran 10mb" className="mb-1" />
              <Subtitle text="Bermaterai dan di cap basah" className="mb-1" />
              <FileInput
                fileName="Surat-Kuasa"
                accept=".pdf,.word"
                fileUrl={formFields.suratKuasa}
                onChange={(fileUrl) => {
                  setFormFields({ ...formFields, suratKuasa: fileUrl });
                  if (fileUrl) {
                    setErrors({ ...errors, suratKuasa: "" });
                  }
                }}
                errorText={errors.suratKuasa}
              />
            </div>

            <div>
              <SectionPoint text="File KTP" />
              <Subtitle text="File maksimal berukuran 10mb" className="mb-7" />

              <FileInput
                fileName="File-KTP"
                accept=".pdf,.jpg,.jpeg,.png"
                fileUrl={formFields.fileKtp}
                onChange={(fileUrl) => {
                  setFormFields({ ...formFields, fileKtp: fileUrl });
                  if (fileUrl) {
                    setErrors({ ...errors, fileKtp: "" });
                  }
                }}
                errorText={errors.fileKtp}
              />
            </div>
          </div>

          <div className="my-10"></div>

          <div className="w-full flex justify-end gap-4 mt-6">
            <FormButton onClick={handleSubmit}>Lanjutkan</FormButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPemodalPerusahaan;
