import { FaFileAlt } from "react-icons/fa";
import React, { useRef } from "react";

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

  return (
    <div className="mb-4">
      <p className="text-sm mb-1">{label}</p>
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
        accept="application/pdf"
        onChange={onUpload}
        className="hidden"
      />
      {fileUrl && (
        <a
          href={`https://docs.google.com/viewer?url=${encodeURIComponent(
            fileUrl
          )}&embedded=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm mt-2 block"
        >
          Lihat Dokumen
        </a>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <p className="text-xs text-gray-500">File maksimal berukuran 10mb</p>
    </div>
  );
}
