import React from "react";
import { FileText } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

interface FileInputProps {
  label: string;
  subLabel?: string;
  fileUrl?: string;
  onChange: (e: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  subLabel,
  fileUrl,
  onChange,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function getFileNameFromUrl(url?: string | null): string | null {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);
      return fileName || null;
    } catch (error) {
      return null;
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi maksimal 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", label);
    formData.append("media", file);

    try {
      const res = await axios.post(
        "https://api-media.inovatiftujuh8.com/api/v1/media/upload",
        formData
      );

      const url = res.data?.data?.path;
      if (url) {
        // set callback
        onChange(url);

        Swal.fire({
          title: "Berhasil",
          text: `Upload ${label} berhasil!`,
          icon: "success",
          timer: 3000,
        });
      } else {
        alert("Upload gagal, tidak ada URL yang diterima.");
      }
    } catch (error) {
      console.error("Gagal upload KTP:", error);
      Swal.fire({
        title: "Gagal",
        text: "Upload gagal. Silakan coba lagi.",
        icon: "warning",
        timer: 3000,
      });
    }
  };

  return (
    <div className="space-y-2">
      {subLabel && <p className="text-sm text-gray-500">{subLabel}</p>}
      <label className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-2 md:px-6 py-2 rounded-lg cursor-pointer font-semibold text-[12px]">
        <FileText size={13} />
        {label}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </label>

      {fileUrl && (
        <div className="flex items-center gap-2 text-xs text-gray-800 bg-gray-100 px-3 py-1 rounded-md w-fit border border-gray-400">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate max-w-[120px] text-inherit no-underline"
          >
            {getFileNameFromUrl(fileUrl)}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileInput;
