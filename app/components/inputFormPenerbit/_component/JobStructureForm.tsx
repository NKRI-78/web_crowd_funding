import React from "react";
import TextField from "./TextField";
import FileInput from "./FileInput";
import SectionPoint from "./SectionPoint";
import SectionSubtitle from "./SectionSubtitle";
import { JobStructureError } from "../FormPenerbit";

export interface JobStructureData {
  nama: string;
  jabatan: string;
  noKTP: string;
  fileKTP: string;
  fileNPWP: string;
}

interface JobStructureFormProps {
  label?: string;
  data: JobStructureData;
  onChange: (update: keyof JobStructureData, value: string) => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  errors?: JobStructureError;
}

const JobStructureForm: React.FC<JobStructureFormProps> = ({
  label,
  data,
  onChange,
  onDelete,
  errors,
  showDeleteButton = false,
}) => {
  return (
    <div className="w-full flex flex-col mt-2">
      <div className="flex justify-between">
        <SectionPoint text={label ?? ""} />

        {showDeleteButton && (
          <button
            onClick={onDelete}
            className="bg-gray-200 px-2 rounded-md hover:bg-gray-200"
          >
            <h4 className="font-semibold text-xs text-gray-500 hover:text-gray-700">
              Hapus
            </h4>
          </button>
        )}
      </div>

      <div className="mt-2 mb-2 w-full flex gap-2">
        <div className="w-full">
          <p className="text-[11px] mb-1 font-semibold text-gray-500">Nama</p>
          <TextField
            placeholder="Nama"
            value={data.nama}
            className="flex-[1]"
            onChange={(e) => onChange("nama", e.target.value)}
            errorText={errors?.nama}
          />
        </div>

        <div className="w-full">
          <p className="text-[11px] mb-1 font-semibold text-gray-500">
            Jabatan
          </p>
          <TextField
            placeholder="Jabatan"
            value={data.jabatan}
            disabled={true}
            className="flex-[1]"
            onChange={(e) => onChange("jabatan", e.target.value)}
            errorText={errors?.jabatan}
          />
        </div>
      </div>

      <div className="w-full">
        <p className="text-[11px] mb-1 font-semibold text-gray-500">No KTP</p>
        <TextField
          placeholder="No KTP"
          value={data.noKTP}
          type="number"
          maxLength={16}
          onChange={(e) => onChange("noKTP", e.target.value)}
          errorText={errors?.noKTP}
        />
      </div>

      <SectionSubtitle
        text="File maksimal berukuran 10mb"
        className="mt-2 mb-1"
      />

      <div className="mb-2 flex gap-2">
        <FileInput
          fileName="Upload KTP"
          placeholder="Upload KTP"
          fileUrl={data.fileKTP}
          onChange={(fileUrl) => onChange("fileKTP", fileUrl)}
          errorText={errors?.fileKTP}
          accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
        />
        <FileInput
          fileName="Upload NPWP"
          placeholder="Upload NPWP"
          fileUrl={data.fileNPWP}
          onChange={(fileUrl) => onChange("fileNPWP", fileUrl)}
          errorText={errors?.fileNPWP}
          accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
        />
      </div>
    </div>
  );
};

export default JobStructureForm;
