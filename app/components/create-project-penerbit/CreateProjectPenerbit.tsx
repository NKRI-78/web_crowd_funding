"use client";

import React, { useEffect } from "react";

import TextField from "../inputFormPenerbit/_component/TextField";
import DropdownSelect from "../inputFormPenerbit/_component/DropdownSelect";
import CustomCheckBox from "../inputFormPenerbit/_component/CustomCheckBox";
import PhotoUploaderContainer from "../inputFormPenerbit/_component/PhotoUploaderContainer";
import FileInput from "../inputFormPenerbit/_component/FileInput";
import SectionPoint from "../inputFormPenerbit/_component/SectionPoint";
import Subtitle from "../inputFormPenerbit/_component/SectionSubtitle";
import { Controller, useForm } from "react-hook-form";
import {
  CreateProjectFormSchema,
  createProjectPenerbitSchema,
  defaultValues,
} from "./create-project-penerbit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyField from "../inputFormPenerbit/_component/CurrencyField";

const CreateProjectPenerbit: React.FC = () => {
  //* form state
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectPenerbitSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  //* read cache
  useEffect(() => {
    const formCache = localStorage.getItem("createProjectPenerbitCache");
    if (formCache) {
      try {
        const parsedCache: CreateProjectFormSchema = JSON.parse(formCache);

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
      localStorage.setItem(
        "createProjectPenerbitCache",
        JSON.stringify(values)
      );
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="w-full py-28 px-6 md:px-24 bg-white">
      <div className="text-black grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* left section */}
        <div className="w-full space-y-3">
          <Controller
            name="namaProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Nama proyek"
                  placeholder="Nama Proyek"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.namaProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="deskripsiProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Deskripsi Proyek"
                  {...register("deskripsiProyek")}
                  placeholder="Deskripsi Proyek"
                  type="textarea"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.deskripsiProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="jenisProyek"
            control={control}
            render={({ field }) => {
              return (
                <DropdownSelect
                  label="Jenis Proyek"
                  value={field.value}
                  options={[
                    {
                      label: "Efek Hutang",
                      value: "Efek Hutang",
                    },
                    {
                      label: "Equitas/Saham",
                      value: "Equitas/Saham",
                    },
                    {
                      label: "Sukuk",
                      value: "Sukuk",
                    },
                  ]}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  errorText={errors.jenisProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="tenor"
            control={control}
            render={({ field }) => {
              return (
                <DropdownSelect
                  label="Tenor Pinjaman"
                  value={field.value}
                  options={[
                    {
                      label: "3 Bulan",
                      value: "3 Bulan",
                    },
                    {
                      label: "6 Bulan",
                      value: "6 Bulan",
                    },
                    {
                      label: "9 Bulan",
                      value: "9 Bulan",
                    },
                    {
                      label: "12 Bulan",
                      value: "12 Bulan",
                    },
                    {
                      label: "18 Bulan",
                      value: "18 Bulan",
                    },
                    {
                      label: "24 Bulan",
                      value: "24 Bulan",
                    },
                  ]}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  errorText={errors.tenor?.message}
                />
              );
            }}
          />

          <Controller
            name="jaminanKolateral"
            control={control}
            render={({ field }) => {
              return (
                <CustomCheckBox
                  label="Jaminan Kolateral"
                  options={[
                    "Tanah Bangunan",
                    "Kendaraan Bermotor",
                    "Rumah",
                    "Surat Berharga",
                  ]}
                  selected={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                  errorText={errors.jaminanKolateral?.message}
                />
              );
            }}
          />

          <Controller
            name="persentaseKeuntungan"
            control={control}
            render={({ field }) => {
              return (
                <DropdownSelect
                  label="Persentase Keuntungan"
                  value={field.value}
                  options={[
                    {
                      label: "10%",
                      value: "10%",
                    },
                  ]}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  errorText={errors.persentaseKeuntungan?.message}
                />
              );
            }}
          />

          <Controller
            name="modalProyek"
            control={control}
            render={({ field }) => {
              return (
                <CurrencyField
                  label="Modal Proyek"
                  placeholder="Rp."
                  value={`${field.value}`}
                  className="mb-2"
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const numericValue = Number(rawValue);
                    field.onChange(numericValue);
                  }}
                  errorText={errors.modalProyek?.message}
                />
              );
            }}
          />
        </div>

        {/* right section */}
        <div className="w-full space-y-3">
          <Controller
            name="fotoProyek"
            control={control}
            render={({ field }) => {
              return (
                <PhotoUploaderContainer
                  label="Foto Proyek"
                  photoPaths={field.value}
                  fileOnChange={(urls) => {
                    field.onChange(urls);
                  }}
                  errorText={errors.fotoProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="jenisInstansiProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Jenis Instansi Pemberi Proyek"
                  placeholder="Jenis Instansi Pemberi Proyek"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.jenisInstansiProyek?.message}
                />
              );
            }}
          />

          <Controller
            name="websiteInstansiProyek"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  label="Website Pemberi Proyek"
                  placeholder="Website Pemberi Proyek"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errorText={errors.websiteInstansiProyek?.message}
                />
              );
            }}
          />

          <div className="w-full flex gap-x-4">
            <div>
              <SectionPoint text="File SPK" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="fileSPK"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileUrl={field.value}
                      fileName="File SPK"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.fileSPK?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="File LOA" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="fileLOA"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileName="File LOA"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.fileLOA?.message}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="w-full flex gap-x-4">
            <div>
              <SectionPoint text="Dokumen Kontrak" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="dokumenKontrak"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileName="Dokumen Kontrak"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.dokumenKontrak?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="Rekening Koran" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="rekeningKoran"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileName="Rekening Koran"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.rekeningKoran?.message}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="w-full flex gap-x-4">
            <div>
              <SectionPoint text="Laporan Keuangan" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="laporanKeuangan"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileName="Laporan Keuangan"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.laporanKeuangan?.message}
                    />
                  );
                }}
              />
            </div>

            <div>
              <SectionPoint text="Prospektus" />
              <Subtitle text="File maksimal berukuran 10mb" className="my-1" />

              <Controller
                name="prospektus"
                control={control}
                render={({ field }) => {
                  return (
                    <FileInput
                      fileName="Prospektus"
                      fileUrl={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      errorText={errors.prospektus?.message}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPenerbit;
