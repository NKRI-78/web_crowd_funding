import { FaFileAlt } from "react-icons/fa";
import React, { useRef } from "react";
import { useFileViewerModal } from "../hooks/useFileViewerModal";

type FileUploadProps = {
  label: string;
  fileUrl?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function FileUpload({
  label,
  fileUrl,
  onUpload,
  error,
}: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { openFile } = useFileViewerModal();

  return (
    <div className="mb-4">
      <p className="text-sm mb-1">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </p>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center w-56 bg-gray-800 text-white py-2 rounded-lg"
      >
        <FaFileAlt size={20} className="mx-2" /> Upload Dokumen
      </button>
      <input
        type="file"
        ref={fileRef}
        accept="image/*,application/pdf"
        multiple
        onChange={onUpload}
        className="hidden"
      />
      {fileUrl && (
        <button
          type="button"
          onClick={() => openFile(fileUrl)}
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm mt-2 block"
        >
          Lihat Dokumen
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <p className="text-xs text-gray-500">File maksimal berukuran 10mb</p>
    </div>
  );
}
