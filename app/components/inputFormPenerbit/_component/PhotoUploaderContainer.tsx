import React, { useEffect, useRef, useState } from "react";
import { FolderUp, X } from "lucide-react";
import axios from "axios";
import { compressImage } from "@/app/helper/CompressorImage";

interface PhotoUploaderContainerProps {
  fileOnChange: (urls: string[]) => void;
  photoPaths?: string[];
  errorText?: string;
}

const PhotoUploaderContainer: React.FC<PhotoUploaderContainerProps> = ({
  fileOnChange,
  errorText,
  photoPaths,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const allowedTypes: string[] = ["image/jpeg", "image/png"];
  const MAX_FILES = 5;

  const disabled = uploadedUrls.length >= MAX_FILES || isUploading;

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append("folder", "web");
      formData.append("subfolder", file.name);
      formData.append("media", compressedFile);

      const res = await axios.post(
        "https://api-media.inovatiftujuh8.com/api/v1/media/upload",
        formData
      );

      return res.data?.data?.path || null;
    } catch (error) {
      console.error("Upload gagal:", error);
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const remainingSlots = MAX_FILES - uploadedUrls.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    const uploaded: string[] = [];

    for (const file of filesToUpload) {
      const url = await uploadFile(file);
      if (url) uploaded.push(url);
    }

    const allUploaded = [...uploadedUrls, ...uploaded];
    setUploadedUrls(allUploaded);
    fileOnChange(allUploaded);

    setIsUploading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = ""; // reset
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerInput = () => {
    if (!disabled) inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const updated = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(updated);
    fileOnChange(updated);
  };

  useEffect(() => {
    if (photoPaths && photoPaths.length > 0) {
      setUploadedUrls(photoPaths);
      fileOnChange(photoPaths);
    }
  }, [photoPaths]);

  return (
    <>
      <div
        className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition ${
          errorText
            ? "border-red-500"
            : isDragging
            ? "border-blue-700 bg-blue-50"
            : "border-blue-500"
        }`}
        onClick={triggerInput}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        {uploadedUrls.length === 0 && (
          <>
            <FolderUp className="w-8 h-8 text-blue-400" />
            <p className="text-sm font-medium text-gray-600 my-2">
              Seret file Anda ke sini
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">Atau</span>
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerInput();
                }}
                className={
                  disabled
                    ? "text-xs text-gray-500 border border-gray-600 px-3 py-1 rounded-md"
                    : "text-xs text-blue-500 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition"
                }
              >
                Telusuri file
              </button>
            </div>
          </>
        )}

        {/* List URL preview */}
        {uploadedUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center max-w-full py-1">
            {uploadedUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 text-xs gap-x-2 px-3 py-1 rounded-md"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url.split("/").pop()}
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="hover:bg-amber-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isUploading && (
          <p className="text-xs text-gray-500 mt-2 italic">
            Mengunggah file...
          </p>
        )}
      </div>

      <input
        type="file"
        accept=".jpg,.png"
        multiple
        hidden
        ref={inputRef}
        onChange={handleInputChange}
      />

      {errorText ? (
        <p className="text-red-500 text-xs mt-2">{errorText}</p>
      ) : (
        <p className="mt-2 text-xs text-gray-500">
          Hanya mendukung file .jpg dan .png.{" "}
          <span className="text-black">Maksimal 5 foto.</span>
        </p>
      )}
    </>
  );
};

export default PhotoUploaderContainer;
