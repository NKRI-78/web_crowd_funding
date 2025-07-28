"use client";

import { useState } from "react";
import { useFormPenerbit } from "./_hooks/useFormPenerbit";

import TextField from "./_component/TextField";
import JobStructureForm from "./_component/JobStructureForm";
import FileInput from "./_component/FileInput";
import MonthSelection from "./_component/MonthSelection";
import SectionTitle from "./_component/SectionTitle";
import SectionPoint from "./_component/SectionPoint";
import SectionSubtitle from "./_component/SectionSubtitle";
import CustomSelection from "./_component/CustomSelection";
import FormButton from "./_component/FormButton";
import DropdownSelect from "./_component/DropdownSelect";
import CurrencyField from "./_component/CurrencyField";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import CustomCheckBox from "./_component/CustomCheckBox";
import AddButton from "./_component/AddButton";

type Props = {
  onBack: () => void;
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
  direktur?: JobStructureError[];
  komisaris?: JobStructureError[];
  direkturErrorText?: string;
  komisarisErrorText?: string;
  fotoProyek?: string;
  titleProyek?: string;
  nilaiNominal?: string;
  jenisObligasi?: string;
  jangkaWaktu?: string;
  tingkatBunga?: string;
  jadwalBunga?: string;
  jadwalPokok?: string;
  penggunaanDana?: string;
  jaminanKolateral?: string;
  deskripsiPekerjaan?: string;
  jenisBiaya?: string;
  fileDokumenKontrakApbn?: string;
  noKontrakApbn?: string;
  companyProfile?: string;
}

const FormPenerbit: React.FC<Props> = ({ onBack }) => {
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
    if (!formState.fotoProyek?.trim())
      newErrors.fotoProyek = "Foto Proyek wajib diisi";
    if (!formState.titleProyek?.trim())
      newErrors.titleProyek = "Judul Proyek wajib diisi";
    if (!formState.nilaiNominal?.trim())
      newErrors.nilaiNominal = "Nilai Nominal wajib diisi";
    if (!formState.jenisObligasi?.trim())
      newErrors.jenisObligasi = "Jenis Obligasi wajib diisi";
    if (!formState.jangkaWaktu?.trim())
      newErrors.jangkaWaktu = "Jangka Waktu wajib diisi";
    if (!formState.tingkatBunga?.trim())
      newErrors.tingkatBunga = "Tingkat Bunga wajib diisi";
    if (!formState.jadwalBunga?.trim())
      newErrors.jadwalBunga = "Jadwal Bunga wajib diisi";
    if (!formState.jadwalPokok?.trim())
      newErrors.jadwalPokok = "Jadwal Pokok wajib diisi";
    if (formState.penggunaanDana?.length === 0)
      newErrors.penggunaanDana = "Penggunaan Dana wajib diisi";
    if (formState.jaminanKolateral?.length === 0)
      newErrors.jaminanKolateral = "Jaminan Kolateral wajib diisi";
    if (formState.direktur?.length === 0)
      newErrors.direkturErrorText = "Direktur wajib ditambahkan";
    if (formState.komisaris?.length === 0)
      newErrors.komisarisErrorText = "Komisaris wajib ditambahkan";
    if (!formState.deskripsiPekerjaan?.trim())
      newErrors.deskripsiPekerjaan = "Deskripsi Pekerjaan wajib diisi";
    if (!formState.jenisBiaya?.trim())
      newErrors.jenisBiaya = "Jenis Biaya wajib diisi";
    if (!formState.companyProfile?.trim())
      newErrors.companyProfile = "Company Profile wajib diisi";
    if (!formState.jaminanKolateral) {
      newErrors.jaminanKolateral = "Jaminan Kolateral wajib diisi";
    }
    if (Number(formState.nilaiNominal) > 10_000_000_000) {
      newErrors.nilaiNominal = "Nilai Nominal Maks 10 Miliar";
    }
    if (formState.jenisBiaya === "Iya") {
      if (!formState.fileDokumenKontrakApbn) {
        newErrors.fileDokumenKontrakApbn = "Dokumen Kontrak wajib diisi";
      }
      if (!formState.noKontrakApbn) {
        newErrors.noKontrakApbn = "Nomor Kontrak wajib diisi";
      }
    }

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
  const onSubmit = async () => {
    const validForm = validateForm();
    if (!validForm) return;

    // hit api
    console.log("Hit API");
    try {
      const draft = localStorage.getItem("publisherDraft");
      const userData = localStorage.getItem("user");
      console.log("Test", draft && userData);
      if (draft && userData) {
        console.log(draft);
        const draftParsed = JSON.parse(draft);
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
          npwp_path: "-",
          total_employees: draftParsed.total_employees.toString(),
          laporan_keuangan_path: formState.laporanKeuangan,
          address: draftParsed.address,
          directors:
            formState.direktur.length === 1
              ? formState.direktur.map((dir) => ({
                  title: "Direktur",
                  name: dir.nama,
                  position: "Direktur",
                  ktp: dir.noKTP,
                  ktp_path: dir.fileKTP,
                  npwp: dir.fileNPWP,
                  npwp_path: "-",
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
                  npwp: dir.fileNPWP,
                  npwp_path: "-",
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
            npwp: kom.fileNPWP,
            npwp_path: "-",
          })),
          project: {
            title: formState.titleProyek,
            jenis_obligasi: formState.jenisObligasi,
            jumlah_minimal: formState.nilaiNominal,
            jangka_waktu: formState.jangkaWaktu,
            tingkat_bunga: `${formState.tingkatBunga}%`,
            jaminan_kolateral: formState.jaminanKolateral.map(
              (kolateralValue) => ({
                name: kolateralValue,
              })
            ),
            company_profile: formState.companyProfile,
            jadwal_pembayaran_bunga: formState.jadwalBunga,
            jadwal_pembayaran_pokok: formState.jadwalPokok,
            penggunaan_dana: formState.penggunaanDana.map((danaValue) => ({
              name: danaValue,
            })),
            deskripsi_pekerjaan: formState.deskripsiPekerjaan,
            project_media_path: formState.fotoProyek,
            no_contract_path: formState.fileDokumenKontrakApbn ?? "-",
            no_contract_value: formState.noKontrakApbn ?? "-",
            is_apbn: formState.jenisBiaya === "Iya",
          },
        };
        console.log("data ", payload);
        console.log("data ", formState);

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

  return (
    <div className="px-6 md:px-24 bg-white">
      <div className="w-full py-28 text-black grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
        {/* === left section === */}
        <section className="w-full">
          {/* 2. Struktur Permodalan */}
          <div className="w-full flex flex-col">
            <SectionTitle text="2. Struktur Permodalan" />

            <SectionPoint text="Laporan Keuangan" className="mt-2" />
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

            <div className="mt-3">
              <SectionPoint text="Foto Proyek" className="mt-2" />
              <SectionSubtitle
                text="File maksimal berukuran 10mb"
                className="my-1"
              />

              <FileInput
                fileName="Foto Proyek"
                fileUrl={formState.fotoProyek}
                accept=".jpg,.jpeg,.png,.heic,.heif"
                onChange={(fileUrl) => {
                  updateField("fotoProyek", fileUrl);
                  if (fileUrl) {
                    setErrors({ ...errors, fotoProyek: "" });
                  }
                }}
                errorText={errors.fotoProyek}
                multiple
              />

              <TextField
                label="Title Proyek"
                placeholder="Title Proyek"
                value={formState.titleProyek || ""}
                className="my-2"
                onChange={(e) => {
                  updateField("titleProyek", e.target.value);
                  if (e.target.value) {
                    setErrors({ ...errors, titleProyek: "" });
                  }
                }}
                errorText={errors.titleProyek}
              />
              <DropdownSelect
                label="Jenis Obligasi"
                options={[{ label: "Konvensional", value: "konvensional" }]}
                value={formState.jenisObligasi || ""}
                onChange={(val) => {
                  updateField("jenisObligasi", val);
                  if (val) {
                    setErrors({ ...errors, titleProyek: "" });
                  }
                }}
                placeholder="Jenis Obligasi"
                maxHeightDropdown="180px"
                className="mb-2"
                errorText={errors.jenisObligasi}
              />

              <CurrencyField
                label="Nilai Nominal"
                placeholder="Rp."
                value={formState.nilaiNominal || ""}
                className="mb-2"
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const numericValue = Number(rawValue);

                  updateField("nilaiNominal", rawValue);

                  if (!rawValue) {
                    setErrors((prev) => ({
                      ...prev,
                      nilaiNominal: "Nilai Nominal tidak boleh kosong",
                    }));
                  } else if (numericValue > 10_000_000_000) {
                    setErrors((prev) => ({
                      ...prev,
                      nilaiNominal: "Nilai Nominal Maks 10 Miliar",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      nilaiNominal: "",
                    }));
                  }
                }}
                errorText={errors.nilaiNominal}
              />
            </div>
          </div>
        </section>

        {/* === right section === */}
        <section className="w-full">
          <div className="w-full flex gap-2 mb-3">
            <DropdownSelect
              label="Jangka Waktu"
              options={[{ label: "6 Bulan", value: "6 Bulan" }]}
              // defaultValue="6 Bulan"
              value={formState.jangkaWaktu || ""}
              onChange={(val) => {
                updateField("jangkaWaktu", val);
                if (val) {
                  setErrors({ ...errors, jangkaWaktu: "" });
                }
              }}
              placeholder="Jangka Waktu"
              maxHeightDropdown="180px"
              className="flex-[1]"
              errorText={errors.jangkaWaktu}
            />
            <DropdownSelect
              label="Tingkat Bunga"
              options={[{ label: "10%", value: "10" }]}
              // defaultValue="10"
              value={formState.tingkatBunga || ""}
              onChange={(val) => {
                updateField("tingkatBunga", val);
                if (val) {
                  setErrors({ ...errors, tingkatBunga: "" });
                }
              }}
              placeholder="Tingkat Bunga"
              maxHeightDropdown="180px"
              className="flex-[1]"
              errorText={errors.tingkatBunga}
            />
          </div>

          <MonthSelection
            label="Jadwal Pembayaran Bunga"
            selected={formState.jadwalBunga || ""}
            onChange={(val) => updateField("jadwalBunga", val)}
          />

          <MonthSelection
            label="Jadwal Pembayaran Pokok"
            selected={formState.jadwalPokok || ""}
            onChange={(val) => updateField("jadwalPokok", val)}
          />

          <CustomCheckBox
            label="Penggunaan Dana"
            options={["Modal Usaha", "Pengembangan Usaha", "Proyek"]}
            selected={formState.penggunaanDana}
            onChange={(val) => {
              updateField("penggunaanDana", val);
              if (val) {
                setErrors({ ...errors, penggunaanDana: "" });
              }
            }}
            errorText={errors.penggunaanDana}
          />

          <CustomCheckBox
            label="Jaminan Kolateral"
            options={[
              "Tanah Bangunan",
              "Kendaraan Bermotor",
              "Rumah",
              "Surat Berharga",
            ]}
            selected={formState.jaminanKolateral}
            onChange={(val) => {
              updateField("jaminanKolateral", val);
              if (val) {
                setErrors({ ...errors, jaminanKolateral: "" });
              }
            }}
            errorText={errors.jaminanKolateral}
          />

          <TextField
            label="Deskripsi Pekerjaan"
            placeholder="Maks 1500 kata"
            type="textarea"
            maxWords={1500}
            value={formState.deskripsiPekerjaan || ""}
            onChange={(e) => {
              updateField("deskripsiPekerjaan", e.target.value);
              if (e.target.value) {
                setErrors({ ...errors, deskripsiPekerjaan: "" });
              }
            }}
            errorText={errors.deskripsiPekerjaan}
          />

          <CustomSelection
            label="Apakah di biaya oleh APBN/APBD?"
            options={["Iya", "Tidak"]}
            selected={formState.jenisBiaya || ""}
            onChange={(val) => {
              updateField("jenisBiaya", val);

              if (val === "Tidak") {
                setErrors({
                  ...errors,
                  fileDokumenKontrakApbn: "",
                  noKontrakApbn: "",
                });
              }
            }}
            showWhenValue="Iya"
            customContent={
              <div className="flex gap-x-3">
                <div>
                  <p className="text-[12px] mb-1 font-semibold text-gray-500">
                    Dokumen Kontrak
                  </p>
                  <FileInput
                    fileName="Dokumen Kontrak APBN"
                    fileUrl={formState.fileDokumenKontrakApbn}
                    accept=".pdf"
                    onChange={(fileUrl) => {
                      updateField("fileDokumenKontrakApbn", fileUrl);
                      if (fileUrl) {
                        setErrors({ ...errors, fileDokumenKontrakApbn: "" });
                      }
                    }}
                    errorText={errors.fileDokumenKontrakApbn}
                  />
                </div>

                <div>
                  <p className="text-[12px] mb-1 font-semibold text-gray-500">
                    No Kontrak
                  </p>
                  <TextField
                    placeholder="No Kontrak"
                    value={formState.noKontrakApbn || ""}
                    type="text"
                    errorText={errors.noKontrakApbn}
                    onChange={(e) => {
                      updateField("noKontrakApbn", e.target.value);
                      if (e.target.value) {
                        setErrors({ ...errors, noKontrakApbn: "" });
                      }
                    }}
                  />
                </div>
              </div>
            }
          />

          <div className="w-full flex flex-col mt-3">
            <SectionPoint text="Company Profile" />
            <SectionSubtitle
              text="File maksimal berukuran 10mb"
              className="my-1"
            />
            <FileInput
              fileName="Company Profile"
              fileUrl={formState.companyProfile}
              accept=".pdf, .jpg, .png, .jpeg"
              onChange={(fileUrl) => {
                updateField("companyProfile", fileUrl);
                if (fileUrl) {
                  setErrors({ ...errors, companyProfile: "" });
                }
              }}
              errorText={errors.companyProfile}
            />
          </div>

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
              Kirim Data
            </FormButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormPenerbit;
