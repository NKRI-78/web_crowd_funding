import React from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import TextField from "./TextField";
import FileInput from "./FileInput";
import SectionPoint from "./SectionPoint";
import SectionSubtitle from "./SectionSubtitle";
import DropdownSelect from "./DropdownSelect";
import UpdateRing from "./UpdateRing";
import { FormPenerbitValues } from "../formPenerbit.schema";

type NamePrefix = "direktur" | "komisaris";

interface JobStructureFormProps {
  label?: string;
  namePrefix: NamePrefix; // "direktur" | "komisaris"
  index: number; // index pada array
  showDeleteButton?: boolean;
  onDelete?: () => void;
  isKomisaris?: boolean;
  hasDirekturUtama?: boolean; // true jika sudah ada direktur-utama di baris lain
  hasKomisarisUtama?: boolean; // true jika sudah ada komisaris-utama di baris lain
  updateIdentity: string; // untuk UpdateRing
  updateFormKey?: string; // untuk UpdateRing
}

const JobStructureForm: React.FC<JobStructureFormProps> = ({
  label,
  namePrefix,
  index,
  onDelete,
  showDeleteButton = true,
  isKomisaris = false,
  hasDirekturUtama = false,
  hasKomisarisUtama = false,
  updateIdentity,
  updateFormKey,
}) => {
  const { control } = useFormContext<FormPenerbitValues>();

  // pantau jabatan baris ini (agar opsi "*-utama" tetap tampil kalau baris ini yang sedang memegangnya)
  const jabatanThisRow = useWatch({
    control,
    name: `${namePrefix}.${index}.jabatan` as const,
  });

  return (
    <div className="w-full flex flex-col mt-2 p-3 rounded-md bg-gray-50 border">
      <div className="flex justify-between">
        <SectionPoint text={label ?? ""} />

        {showDeleteButton && (
          <button
            onClick={onDelete}
            className="bg-gray-200 px-2 rounded-md hover:bg-gray-200"
            type="button"
          >
            <h4 className="font-semibold text-xs text-gray-500 hover:text-gray-700">
              Hapus
            </h4>
          </button>
        )}
      </div>

      <div className="mt-2 mb-2 w-full flex gap-2">
        {/* Nama */}
        <div className="w-full">
          <p className="text-[11px] mb-1 font-semibold text-gray-500">Nama</p>
          <Controller
            control={control}
            name={`${namePrefix}.${index}.nama` as const}
            render={({ field, fieldState }) => (
              <TextField
                placeholder="Nama"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="flex-[1]"
                errorText={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Jabatan */}
        <div className="w-full">
          <p className="text-[11px] mb-1 font-semibold text-gray-500">
            Jabatan
          </p>

          <Controller
            control={control}
            name={`${namePrefix}.${index}.jabatan` as const}
            render={({ field, fieldState }) => {
              const isUtama =
                jabatanThisRow ===
                (isKomisaris ? "komisaris-utama" : "direktur-utama");

              // jika sudah ada *-utama di baris lain, sembunyikan opsi itu
              // tapi tetap tampilkan kalau baris ini yang memegangnya (agar user bisa mengganti)
              const options = isKomisaris
                ? [
                    ...(!hasKomisarisUtama || isUtama
                      ? [
                          {
                            label: "Komisaris Utama",
                            value: "komisaris-utama" as const,
                          },
                        ]
                      : []),
                    { label: "Komisaris", value: "komisaris" as const },
                  ]
                : [
                    ...(!hasDirekturUtama || isUtama
                      ? [
                          {
                            label: "Direktur Utama",
                            value: "direktur-utama" as const,
                          },
                        ]
                      : []),
                    { label: "Direktur", value: "direktur" as const },
                  ];

              return (
                <DropdownSelect
                  options={options}
                  value={field.value}
                  // defaultValue biar awalnya langsung ke opsi "regular"
                  defaultValue={isKomisaris ? "komisaris" : "direktur"}
                  onChange={(val: string) => field.onChange(val)}
                  placeholder="Jabatan"
                  maxHeightDropdown="180px"
                  errorText={fieldState.error?.message}
                />
              );
            }}
          />
        </div>
      </div>

      {/* No KTP */}
      <div className="w-full">
        <p className="text-[11px] mb-1 font-semibold text-gray-500">No KTP</p>
        <Controller
          control={control}
          name={`${namePrefix}.${index}.noKTP` as const}
          render={({ field, fieldState }) => (
            <TextField
              placeholder="No KTP"
              // pakai string agar tidak hilang leading zero; batasi angka & 16 digit
              value={field.value ?? ""}
              type="text"
              maxLength={16}
              onChange={(e) => {
                const onlyDigits = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 16);
                field.onChange(onlyDigits);
              }}
              errorText={fieldState.error?.message}
            />
          )}
        />
      </div>

      <SectionSubtitle
        text="File maksimal berukuran 10mb"
        className="mt-2 mb-1"
      />

      {/* Uploads */}
      <div className="flex gap-2">
        <UpdateRing
          identity={`${updateIdentity}-upload-ktp`}
          formKey={updateFormKey}
        >
          <Controller
            control={control}
            name={`${namePrefix}.${index}.fileKTP` as const}
            render={({ field, fieldState }) => (
              <FileInput
                fileName="Upload KTP"
                placeholder="Upload KTP"
                fileUrl={field.value ?? ""}
                onChange={(fileUrl) => field.onChange(fileUrl)}
                errorText={fieldState.error?.message}
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
              />
            )}
          />
        </UpdateRing>

        <UpdateRing
          identity={`${updateIdentity}-upload-npwp`}
          formKey={updateFormKey}
        >
          <Controller
            control={control}
            name={`${namePrefix}.${index}.fileNPWP` as const}
            render={({ field, fieldState }) => (
              <FileInput
                fileName="Upload NPWP"
                placeholder="Upload NPWP"
                fileUrl={field.value ?? ""}
                onChange={(fileUrl) => field.onChange(fileUrl)}
                errorText={fieldState.error?.message}
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
              />
            )}
          />
        </UpdateRing>
      </div>
    </div>
  );
};

export default JobStructureForm;
