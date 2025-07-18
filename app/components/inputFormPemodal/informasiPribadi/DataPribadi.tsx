// ComponentDataPribadi.tsx
import React, { useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface Props {
  formData: {
    nama: string;
    nik: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    statusPernikahan: string;
    pendidikanTerakhir: string;
    pekerjaan: string;
    pekerjaanLainnya: string;
    addres: string;
    namaBank: string;
    nomorRekening: string;
    namaPemilik: string;
    cabangBank: string;
    ktpUrl: string;
    rekeningKoran: string;
    // npwpUrl: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onGenderChange: (value: string) => void;
  onWeddingChange: (value: string) => void;
  onEducationChange: (value: string) => void;
  onPekerjaanChange: (value: string) => void;
  onUploadKTP: (url: string, keyName: string) => void;
}

const ComponentDataPribadi: React.FC<Props> = ({
  formData,
  onChange,
  onGenderChange,
  onWeddingChange,
  onEducationChange,
  onPekerjaanChange,
  onUploadKTP,
}) => {
  const optionsGender = ["Laki-Laki", "Perempuan"];
  const optionsPernikahan = ["Belum Menikah", "Menikah", "Cerai"];
  const optionsLastEducation = [
    "SD",
    "SMP",
    "SMA",
    "Diploma",
    "Sarjana",
    "Pascasarjana",
  ];
  const pekerjaanOptions = ["PNS", "Swasta", "Wiraswasta", "Lainnya"];
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 17);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const keyName = e.target.getAttribute("data-keyname");
    if (!file || !keyName) return;

    // Validasi maksimal 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", keyName);
    formData.append("media", file);

    // setIsUploading(true);
    setUploadStatus((prev) => ({ ...prev, [keyName]: true }));
    try {
      const res = await axios.post(
        "https://api-media.inovatiftujuh8.com/api/v1/media/upload",
        formData
      );

      const fileUrl = res.data?.data?.path;

      if (fileUrl) {
        const labelMap: { [key: string]: string } = {
          ktpUrl: "KTP",
          rekeningKoran: "Rekening Koran",
          npwpUrl: "NPWP Perusahaan",
        };

        const formattedKey = labelMap[keyName] || keyName;

        Swal.fire({
          title: "Berhasil",
          text: `Upload ${formattedKey} berhasil!`,
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        onUploadKTP(fileUrl, keyName ?? "");
      } else {
        alert("Upload gagal, tidak ada URL yang diterima.");
      }
    } catch (error) {
      console.error("Gagal upload KTP:", error);
      // alert("Upload gagal. Silakan coba lagi.");
      Swal.fire({
        title: "Gagal",
        text: `Upload ${keyName} gagal. Silakan coba lagi.`,
        icon: "warning",
        timer: 3000,
      });
    } finally {
      // setIsUploading(false);
      setUploadStatus((prev) => ({ ...prev, [keyName]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
      <div className="md:border-r-2 md:border-gray-200 pr-7">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Isi Data Sebagai Pemodal</h2>
          <p className="text-sm text-gray-600">
            Untuk memastikan kelancaran proses verifikasi dan layanan yang
            optimal, kami mengajak Anda untuk melengkapi seluruh data secara
            jujur, benar, dan akurat.
          </p>

          <h3 className="font-semibold text-black">1. Informasi Pribadi</h3>

          <div>
            <label className="text-sm font-medium mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={onChange}
              placeholder="Nama"
              className="border p-2 w-full rounded mb-4 placeholder:text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2">NIK KTP</label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={onChange}
              placeholder="NIK KTP"
              className="border p-2 w-full rounded mb-4 placeholder:text-sm"
            />
          </div>

          <div className="flex gap-2">
            <div>
              <label className="text-sm font-medium mb-2">Tempat Lahir</label>
              <input
                type="text"
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={onChange}
                placeholder="Tempat Lahir"
                className="border p-2 w-full rounded mb-4 placeholder:text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2">Tanggal Lahir</label>
              {/* <input
              type="text"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={onChange}
              placeholder="Tanggal Lahir"
              className="border p-2 w-full rounded mb-4"
            /> */}

              <Flatpickr
                options={{
                  dateFormat: "d-m-Y",
                  // maxDate: "today",
                  maxDate: maxDate,
                }}
                value={
                  formData.tanggalLahir
                    ? new Date(formData.tanggalLahir)
                    : undefined
                }
                onChange={(selectedDates) => {
                  const selectedDate = selectedDates[0];
                  if (selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0];
                    onChange({
                      target: {
                        name: "tanggalLahir",
                        value: formatted,
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                placeholder="Tanggal Lahir"
                className="border p-2 w-full rounded mb-4 placeholder:text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2">Jenis Kelamin</label>
            <div className="flex gap-6">
              {optionsGender.map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value={gender}
                    checked={formData.jenisKelamin === gender}
                    onChange={() => onGenderChange(gender)}
                    className="form-radio text-[#4821C2]"
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2">
              Status Pernikahan
            </label>
            <div className="flex gap-6">
              {optionsPernikahan.map((wedding) => (
                <label
                  key={wedding}
                  className="flex text-sm items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="statusPernikahan"
                    value={wedding}
                    checked={formData.statusPernikahan === wedding}
                    onChange={() => onWeddingChange(wedding)}
                    className="form-radio text-[#4821C2]"
                  />
                  <span className="text-gray-700">{wedding}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2">Upload KTP</label>
            <p className="text-xs text-gray-500 mb-2">
              File maksimal berukuran 10mb
            </p>

            {/* Input File yang disembunyikan */}
            <input
              type="file"
              id="ktpUpload"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadStatus["ktpUrl"] === true}
              accept="application/pdf, image/*"
              data-keyname="ktpUrl"
            />

            {/* Label sebagai tombol */}
            <label
              htmlFor="ktpUpload"
              className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
              // className={`inline-flex items-center gap-2 px-4 py-2 ${
              //   uploadStatus["ktpUrl"]
              //     ? "bg-gray-400 cursor-not-allowed"
              //     : "bg-[#505050] hover:bg-gray-800"
              // } text-white rounded-md transition`}
            >
              {/* {uploadStatus["ktpUrl"] ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : ( */}
              <>
                <FaFileAlt />
                Upload Dokumen
              </>
              {/* )} */}
            </label>
          </div>
          {formData.ktpUrl && (
            <a
              href={formData.ktpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm block mt-2 mb-2"
            >
              Lihat Dokumen KTP
            </a>
          )}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2">
              Pendidikan Terakhir
            </label>
            <div className="grid grid-cols-3 gap-y-2 gap-x-4">
              {optionsLastEducation.map((education) => (
                <label
                  key={education}
                  className="flex text-sm items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="pendidikanTerakhir"
                    value={education}
                    checked={formData.pendidikanTerakhir === education}
                    onChange={() => onEducationChange(education)}
                    className="form-radio text-[#4821C2]"
                  />
                  <span className="text-gray-700">{education}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* form bagian kanan */}
      <div>
        <div className="mb-4">
          <label className="text-sm font-medium mb-2">Pekerjaan</label>
          <div className="flex flex-wrap gap-6">
            {pekerjaanOptions.map((option) => (
              <label
                key={option}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pekerjaan"
                  value={option}
                  checked={formData.pekerjaan === option}
                  onChange={() => onPekerjaanChange(option)}
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          {formData.pekerjaan === "Lainnya" && (
            <input
              type="text"
              name="pekerjaanLainnya"
              value={formData.pekerjaanLainnya}
              onChange={onChange}
              placeholder="Lainnya"
              className="mt-3 border p-2 w-full rounded text-sm"
            />
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="text-sm font-medium mb-2">
            Alamat Lengkap
          </label>
          <textarea
            id="address"
            name="addres"
            value={formData.addres}
            onChange={onChange}
            placeholder="Alamat sesuai KTP dan alamat domisili"
            className="border p-2 w-full rounded resize-none placeholder:text-sm"
            rows={4}
          ></textarea>
        </div>
        <h2 className="font-semibold text-black">2. Informasi Rekening Bank</h2>

        <div>
          <label className="text-sm font-medium mb-2">Nama Bank</label>
          <input
            type="text"
            name="namaBank"
            placeholder="Nama Bank (misal: BCA)"
            value={formData.namaBank}
            onChange={onChange}
            className="border rounded p-2 w-full mb-4 placeholder:text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2">Nomor Rekening</label>
          <input
            type="text"
            name="nomorRekening"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Masukkan Nomor Rekening"
            value={formData.nomorRekening}
            onChange={onChange}
            className="border rounded p-2 w-full mb-4 placeholder:text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            Nama Pemilik Rekening
          </label>
          <input
            type="text"
            name="namaPemilik"
            placeholder="Masukkan Nama Pemilik Rekening"
            value={formData.namaPemilik}
            onChange={onChange}
            className="border rounded p-2 w-full mb-4 placeholder:text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2">Cabang Bank</label>
          <input
            type="text"
            name="cabangBank"
            placeholder="Masukkan Cabang Bank"
            value={formData.cabangBank}
            onChange={onChange}
            className="border rounded p-2 w-full placeholder:text-sm"
          />
        </div>

        <div className="mb-4 mt-4">
          <label className="text-md mb-2">Rekening Koran</label>
          <p className="text-xs text-gray-500 mb-2">
            File maksimal berukuran 10mb
          </p>

          {/* Input File yang disembunyikan */}
          <input
            type="file"
            id="rekeningKoranUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadStatus["rekeningKoran"] === true}
            accept="application/pdf, image/*"
            data-keyname="rekeningKoran"
          />

          {/* Label sebagai tombol */}
          <label
            htmlFor="rekeningKoranUpload"
            className="inline-flex text-sm items-center gap-2 py-2 px-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-800 transition"
            // className={`inline-flex items-center gap-2 px-4 py-2 ${
            //   uploadStatus["rekeningKoran"]
            //     ? "bg-gray-400 cursor-not-allowed"
            //     : "bg-[#505050] hover:bg-gray-800"
            // } text-white rounded-md transition`}
          >
            {/* {uploadStatus["rekeningKoran"] ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : ( */}
            <>
              <FaFileAlt />
              Upload Dokumen
            </>
            {/* )} */}
          </label>
        </div>
        {formData.rekeningKoran && (
          <a
            href={formData.rekeningKoran}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm block mt-2 mb-2"
          >
            Lihat Rekening Koran
          </a>
        )}
      </div>
    </div>
  );
};

export default ComponentDataPribadi;
