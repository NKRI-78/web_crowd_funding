"use client";

import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";
import PhotoUploaderContainer from "../inputFormPenerbit/_component/PhotoUploaderContainer";
import VideoUploaderContainer from "../inputFormPenerbit/_component/VideoUploadContainer";
import Subtitle from "../inputFormPemodalPerusahaan/component/SectionSubtitle";
import FileInput from "../inputFormPemodalPerusahaan/component/FileInput";
import SectionPoint from "../inputFormPenerbit/_component/SectionPoint";
import DocumentRow from "./DocumentRow";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSection from "./FormSection";
import FormButton from "../inputFormPemodalPerusahaan/component/FormButton";
import { Controller, useForm } from "react-hook-form";
import {
  defaultValues,
  formDokumenPelengkapPenerbitSchema,
  FormDokumenPelengkapPenerbitSchema,
} from "./form-schema";

const getUserToken = (): string => {
  const userCookie = Cookies.get("user");
  if (!userCookie) throw "User tidak ditemukan";
  return JSON.parse(userCookie).token;
};

const FORM_CACHE_KEY = "formDokumenPelengkapPenerbitCache";

const FormDokumenTambahanPage: React.FC = () => {
  const skipCacheWrite = useRef(false);

  //* form state
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    control,
    formState: { errors },
    reset,
  } = useForm<FormDokumenPelengkapPenerbitSchema>({
    resolver: zodResolver(formDokumenPelengkapPenerbitSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  //* init state
  useEffect(() => {}, []);

  //* read cache
  useEffect(() => {
    const formCache = localStorage.getItem(FORM_CACHE_KEY);
    if (formCache) {
      try {
        const parsedCache: FormDokumenPelengkapPenerbitSchema =
          JSON.parse(formCache);

        reset({
          ...defaultValues,
          ...parsedCache,
        });
      } catch (err) {
        console.error("Cache tidak valid:", err);
      }
    }
  }, [reset]);

  //* write cache
  useEffect(() => {
    const subscription = watch((values) => {
      if (!skipCacheWrite.current) {
        localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(values));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="w-full py-28 px-6 md:px-24 bg-white">
      <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* right section */}
        <div className="w-full space-y-4">
          <Controller
            control={control}
            name="fotoKantorKaryawan"
            render={({ field }) => {
              return (
                <PhotoUploaderContainer
                  label="Foto Kantor & Karyawan"
                  maxUpload={10}
                  photoPaths={field.value}
                  fileOnChange={field.onChange}
                  errorText={errors.fotoKantorKaryawan?.message}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="fotoKegiatanUsaha"
            render={({ field }) => {
              return (
                <PhotoUploaderContainer
                  label="Foto Kegiatan Usaha"
                  maxUpload={10}
                  photoPaths={field.value}
                  fileOnChange={field.onChange}
                  errorText={errors.fotoKegiatanUsaha?.message}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="videoProfilPerusahaan"
            render={({ field }) => {
              return (
                <VideoUploaderContainer
                  label="Video Profil Perusahaan"
                  videoPath={field.value}
                  fileOnChange={(videoUrl) => {
                    field.onChange(videoUrl);
                  }}
                  errorText={errors.videoProfilPerusahaan?.message}
                />
              );
            }}
          />
        </div>

        {/* left section */}
        <FormSection>
          <DocumentRow>
            <div>
              <SectionPoint text="Surat Keterangan Domisili" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="suratKeteranganDomisili"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Surat Keterangan Domisili"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.suratKeteranganDomisili?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Dokumen Perizinan Lainya" optional />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="dokumenPerizinanLainnya"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Dokumen Perizinan Lainya"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.dokumenPerizinanLainnya?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Short CV Manajemen" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="shortCvManajemen"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Short CV Manajemen"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.shortCvManajemen?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Daftar Piutang" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="daftarPiutang"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Daftar Piutang"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.daftarPiutang?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="List Data Suplier" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="listDataSupplier"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="List Data Suplier"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.listDataSupplier?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="List Pekerjaan 2 Tahun Terakhir" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="listPekerjaan2TahunTerakhir"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="List Pekerjaan 2 Tahun Terakhir"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.listPekerjaan2TahunTerakhir?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Laporan Pajak Tahunan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="laporanPajakTahunan"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Laporan Pajak Tahunan"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.laporanPajakTahunan?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="RAB" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="rab"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="RAB"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.rab?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Cashflow Project" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="cashflowProject"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Cashflow Project"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.cashflowProject?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Timeline Pekerjaan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="timelinePekerjaan"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Timeline Pekerjaan"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.timelinePekerjaan?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <DocumentRow>
            <div>
              <SectionPoint text="Project Summary" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="projectSummary"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Project Summary"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.projectSummary?.message}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SectionPoint text="Proyeksi Pendapatan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                control={control}
                name="proyeksiPendapatan"
                render={({ field }) => {
                  return (
                    <FileInput
                      accept=".pdf,.word"
                      fileName="Proyeksi Pendapatan"
                      fileUrl={field.value}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      errorText={errors.proyeksiPendapatan?.message}
                    />
                  );
                }}
              />
            </div>
          </DocumentRow>

          <div className="w-full flex justify-end pr-16 pt-4">
            <FormButton onClick={() => {}}>Submit</FormButton>
          </div>
        </FormSection>
      </div>
    </div>
  );
};

export default FormDokumenTambahanPage;
