import React, { useEffect, useRef, useState } from "react";

interface AddJobStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

const AddJobStructureModal: React.FC<AddJobStructureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() !== "") {
      onSubmit(title.trim());
      setTitle("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
        <button
          onClick={() => {
            setTitle("");
            onClose();
          }}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-lg font-bold"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Tambah Susunan Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="Masukkan nama susunan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              onClick={() => {
                setTitle("");
                onClose();
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-[#3C2B90] text-white hover:bg-[#2f2173]"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobStructureModal;
