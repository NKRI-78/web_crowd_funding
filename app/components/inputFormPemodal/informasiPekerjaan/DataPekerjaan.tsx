import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import Swal from "sweetalert2";
import { FaFileAlt } from "react-icons/fa";

function getSignatureDataUrlWithWhiteBackground(
  canvas: HTMLCanvasElement
): string {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  const ctx = tempCanvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  ctx.drawImage(canvas, 0, 0);

  return tempCanvas.toDataURL("image/png");
}

interface Props {
  formData: {
    namaPerusahaan: string;
    jabatan: string;
    alamatPerusahaan: string;
    penghasilanBulanan: string;
    tujuanInvestasi: string;
    tujuanInvestasiLainnya: string;
    toleransiResiko: string;
    pengalamanInvestasi: string;
    pengetahuanPasarModal: string;
    setujuKebenaranData: boolean;
    setujuRisikoInvestasi: boolean;
    signature: string;
    npwpUrl: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onPenghasilanBulanan: (value: string) => void;
  onTujuanInvetasi: (value: string) => void;
  onToleransiResiko: (value: string) => void;
  onPengalamanInvestasi: (value: string) => void;
  onPengetahuanPasarModal: (value: string) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignatureSave: (signature: string) => void;
  onUploadKTP: (url: string, keyName: string) => void;
}

const SIG_W = 300;
const SIG_H = 200;

const ComponentDataPekerjaan: React.FC<Props> = ({
  formData,
  onChange,
  onPenghasilanBulanan,
  onTujuanInvetasi,
  onToleransiResiko,
  onPengalamanInvestasi,
  onPengetahuanPasarModal,
  onCheckboxChange,
  onSignatureSave,
  onUploadKTP,
}) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const formPemodalStr = localStorage.getItem("formPemodal");
  const formPemodal = formPemodalStr ? JSON.parse(formPemodalStr) : null;

  const penghasilanBulanan = [
    "1jt - 5jt",
    "5jt - 10jt",
    "10jt - 15jt",
    "15jt - 20jt",
    "20jt - 50jt",
    "50jt - 100jt",
  ];
  const tujuanInvestasi = ["Jangka Pendek", "Jangka Panjang", "Lainnya"];
  const toleransiResiko = ["Rendah", "Menengah", "Tinggi"];
  const pengalamanInvestasi = ["Tidak Ada", "Kurang", "Cukup", "Banyak"];
  const pengetahuanPasarModal = ["Tidak Ada", "Kurang", "Cukup", "Banyak"];
  const [isEmpty, setIsEmpty] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const uploadSignature = async (dataUrl: string): Promise<string | null> => {
    const blob = await (await fetch(dataUrl)).blob();
    const formData = new FormData();
    formData.append("folder", "web");
    formData.append("subfolder", "signature");
    formData.append("media", blob, "signature.png");

    try {
      const res = await axios.post(
        "https://api-media.inovatiftujuh8.com/api/v1/media/upload",
        formData
      );
      const fileUrl = res.data?.data?.path;

      if (fileUrl) {
        Swal.fire({
          title: "Berhasil",
          text: "Tanda tangan berhasil diupload!",
          icon: "success",
          timer: 3000,
        });
        return fileUrl;
      } else {
        alert("Upload gagal, tidak ada URL yang diterima.");
        return null;
      }
    } catch (error) {
      console.error("Gagal upload tanda tangan:", error);
      Swal.fire({
        title: "Gagal",
        text: "Upload tanda tangan gagal. Silakan coba lagi.",
        icon: "error",
        timer: 3000,
      });
      return null;
    }
  };

  const handleSaveSignature = async () => {
    const canvas = signatureRef.current?.getCanvas();
    if (!canvas) return;

    const dataUrl = getSignatureDataUrlWithWhiteBackground(canvas);
    if (!dataUrl) {
      alert("Tanda tangan kosong.");
      return;
    }

    localStorage.setItem("signature", dataUrl);

    const uploadedUrl = await uploadSignature(dataUrl);

    if (uploadedUrl) {
      onSignatureSave(uploadedUrl);
      signatureRef.current?.off();
      setIsSignatureSaved(true);
    }
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    signatureRef.current?.on();
    setIsSignatureSaved(false);
    localStorage.removeItem("signature");
    localStorage.setItem(
      "formPemodal",
      JSON.stringify({ ...formPemodal, signature: "" })
    );
  };

  useEffect(() => {
    const storedSignature = localStorage.getItem("signature");

    if (storedSignature && signatureRef.current) {
      const img = new Image();
      img.src = storedSignature;
      img.onload = () => {
        const canvas = signatureRef.current?.getCanvas();
        const ctx = canvas?.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        signatureRef.current?.off();
        setIsSignatureSaved(true);
      };
    }
  }, []);

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
        Swal.fire({
          title: "Berhasil",
          text: `Upload ${keyName} berhasil!`,
          icon: "success",
          timer: 3000,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:border-r-2 md:border-gray-200 pr-7">
        <h2 className="font-semibold text-black mb-2">
          3. Informasi Pekerjaan (Jika Bekerja)
        </h2>

        <div>
          <label className="text-sm font-medium mb-2">Nama Perusahaan</label>
          <input
            type="text"
            name="namaPerusahaan"
            value={formData.namaPerusahaan}
            onChange={onChange}
            placeholder="Masukan Nama Perusahaan"
            className="border border-gray-500 p-2 w-full rounded mb-4 placeholder:text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2">Jabatan</label>
          <input
            type="text"
            name="jabatan"
            value={formData.jabatan}
            onChange={onChange}
            placeholder="Masukan Jabatan"
            className="border border-gray-500 p-2 w-full rounded mb-4 placeholder:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="text-sm font-medium mb-2">
            Alamat Perusahaan
          </label>
          <textarea
            id="alamatPerusahaan"
            name="alamatPerusahaan"
            value={formData.alamatPerusahaan}
            onChange={onChange}
            placeholder="Masukan Alamat Perusahaan"
            className="border border-gray-500 p-2 w-full rounded resize-none placeholder:text-sm"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-2">
            Penghasilan Bulanan
          </label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {penghasilanBulanan.map((item) => (
              <label
                key={item}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="penghasilanBulanan"
                  value={item}
                  checked={formData.penghasilanBulanan === item}
                  onChange={() => onPenghasilanBulanan(item)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
        <h2 className="font-semibold text-black mb-2">4. Profil Resiko</h2>
        <label className="text-sm font-medium mb-2">Tujuan Investasi</label>
        <div className="mb-4">
          <div className="flex flex-wrap gap-6">
            {tujuanInvestasi.map((option) => (
              <label
                key={option}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="tujuanInvestasi"
                  value={option}
                  checked={formData.tujuanInvestasi === option}
                  onChange={() => onTujuanInvetasi(option)}
                  className="form-radio text-purple-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {formData.tujuanInvestasi === "Lainnya" && (
            <input
              type="text"
              name="tujuanInvestasiLainnya"
              value={formData.tujuanInvestasiLainnya}
              onChange={onChange}
              placeholder="Lainnya"
              className="mt-3 border p-2 w-full rounded text-sm"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-2">Toleransi Resiko</label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toleransiResiko.map((item) => (
              <label
                key={item}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="toleransiResiko"
                  value={item}
                  checked={formData.toleransiResiko === item}
                  onChange={() => onToleransiResiko(item)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-2">
            Pengalaman Investasi
          </label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pengalamanInvestasi.map((item) => (
              <label
                key={item}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pengalamanInvestasi"
                  value={item}
                  checked={formData.pengalamanInvestasi === item}
                  onChange={() => onPengalamanInvestasi(item)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium mb-2">
            Pegetahuan tentang Pasar Modal
          </label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pengetahuanPasarModal.map((item) => (
              <label
                key={item}
                className="flex text-sm items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="pengetahuanPasarModal"
                  value={item}
                  checked={formData.pengetahuanPasarModal === item}
                  onChange={() => onPengetahuanPasarModal(item)}
                  className="form-radio text-[#4821C2]"
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* KANAN */}
      <div>
        <div className="mb-4 mt-4">
          <label className="text-md mb-2">NPWP Perusahaan</label>
          <p className="text-xs text-gray-500 mb-2">
            File maksimal berukuran 10mb
          </p>

          {/* Input File yang disembunyikan */}
          <input
            type="file"
            id="npwpUrlUpload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadStatus["npwpUrl"] === true}
            accept="application/pdf, image/*"
            data-keyname="npwpUrl"
          />

          {/* Label sebagai tombol */}
          <label
            htmlFor="npwpUrlUpload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-950 transition"
            // className={`inline-flex items-center gap-2 px-4 py-2 ${
            //   uploadStatus["npwpUrl"]
            //     ? "bg-gray-400 cursor-not-allowed"
            //     : "bg-[#505050] hover:bg-gray-800"
            // } text-white rounded-md transition`}
          >
            {/* {uploadStatus["npwpUrl"] ? (
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
              <FaFileAlt size={20} className="mx-2" />
              Upload Dokumen
            </>
            {/* )} */}
          </label>
        </div>
        {formData.npwpUrl && (
          <a
            href={formData.npwpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm block mt-2 mb-2"
          >
            Lihat NPWP
          </a>
        )}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Pernyataan Kebenaran Data
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Dengan ini saya menyatakan bahwa seluruh data yang saya berikan
            adalah benar, akurat, dan sesuai dengan kondisi saat ini. Saya
            bertanggung jawab penuh atas data yang diinput dan memahami bahwa
            ketidaksesuaian informasi dapat berdampak pada proses investasi.
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="setujuKebenaranData"
              checked={formData.setujuKebenaranData}
              onChange={onCheckboxChange}
              className="form-checkbox text-[#4821C2]"
            />
            <span className="text-sm font-medium text-gray-700">
              Ya, saya setuju
            </span>
          </label>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Pernyataan Memahami Risiko Investasi
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Saya memahami bahwa setiap investasi mengandung risiko, termasuk
            kemungkinan kehilangan sebagian atau seluruh dana yang
            diinvestasikan...
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="setujuRisikoInvestasi"
              checked={formData.setujuRisikoInvestasi}
              onChange={onCheckboxChange}
              className="form-checkbox text-[#4821C2]"
            />
            <span className="text-sm font-medium text-gray-700">
              Ya, saya setuju
            </span>
          </label>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Tanda Tangan Pemohon
          </h3>
          <div
            className="border border-gray-500 rounded bg-white overflow-visible"
            style={{ width: SIG_W, height: SIG_H }}
          >
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              onEnd={() => {
                if (signatureRef.current) {
                  setIsEmpty(signatureRef.current.isEmpty());
                }
              }}
              canvasProps={{
                width: SIG_W,
                height: SIG_H,
                className: "sigCanvas block",
              }}
            />
          </div>

          <div className="flex gap-4 mt-3">
            <button
              type="button"
              onClick={() => {
                handleClearSignature();
                Swal.fire({
                  title: "Berhasil",
                  text: "Tanda tangan berhasil dihapus!",
                  icon: "success",
                  timer: 3000,
                });
              }}
              disabled={!isSignatureSaved}
              className={`px-3 py-1 text-white text-sm rounded ${
                !isSignatureSaved
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Hapus
            </button>

            <button
              type="button"
              disabled={isEmpty || isSignatureSaved}
              onClick={handleSaveSignature}
              className={`px-3 py-1 text-white text-sm rounded ${
                isEmpty || isSignatureSaved
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600"
              }`}
            >
              {isSignatureSaved
                ? "Tanda Tangan Tersimpan"
                : "Simpan Tanda Tangan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDataPekerjaan;
