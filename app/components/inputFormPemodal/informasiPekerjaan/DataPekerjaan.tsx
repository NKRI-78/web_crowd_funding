import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

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
}) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);

  const penghasilanBulanan = [
    "1jt - 5jt",
    "5jt - 10jt",
    "10 - 15jt",
    "15jt - 20jt",
    "20jt - 50jt",
    "50jt - 100jt",
  ];
  const tujuanInvestasi = ["Jangka Pendek", "Jangka Panjang", "Lainnya"];
  const toleransiResiko = ["Rendah", "Menengah", "Tinggi"];
  const pengalamanInvestasi = ["Tidak Ada", "Kurang", "Cukup", "Banyak"];
  const pengetahuanPasarModal = ["Tidak Ada", "Kurang", "Cukup", "Banyak"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="md:border-r-2 md:border-gray-200 pr-7">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          3. Informasi Pekerjaan (Jika Bekerja)
        </h2>

        <div>
          <label className="text-md mb-2">Nama Perusahaan</label>
          <input
            type="text"
            name="namaPerusahaan"
            value={formData.namaPerusahaan}
            onChange={onChange}
            placeholder="Masukan Nama Perusahaan"
            className="border border-gray-500 p-2 w-full rounded mb-4"
          />
        </div>

        <div>
          <label className="text-md mb-2">Jabatan</label>
          <input
            type="text"
            name="jabatan"
            value={formData.jabatan}
            onChange={onChange}
            placeholder="Masukan Jabatan"
            className="border border-gray-500 p-2 w-full rounded mb-4"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="text-md mb-2">
            Alamat Perusahaan
          </label>
          <textarea
            id="alamatPerusahaan"
            name="alamatPerusahaan"
            value={formData.alamatPerusahaan}
            onChange={onChange}
            placeholder="Masukan Alamat Perusahaan"
            className="border border-gray-500 p-2 w-full rounded resize-none"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="text-md mb-2">Penghasilan Bulanan</label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {penghasilanBulanan.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
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
        <h2 className="text-lg md:text-xl font-bold mb-4">4. Profil Resiko</h2>
        <label className="text-md mb-2">Tujuan Investasi</label>
        <div className="mb-4">
          <div className="flex flex-wrap gap-6">
            {tujuanInvestasi.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
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
          <label className="text-md mb-2">Toleransi Resiko</label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toleransiResiko.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
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
          <label className="text-md mb-2">Pengalaman Investasi</label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pengalamanInvestasi.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
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
      </div>

      {/* KANAN */}
      <div>
        <div className="mb-4">
          <label className="text-md mb-2">Pegetahuan tentang Pasar Modal</label>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pengetahuanPasarModal.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
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
            className="border border-gray-300 rounded bg-white overflow-visible"
            style={{ width: SIG_W, height: SIG_H }}
          >
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
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
                signatureRef.current?.clear();
                signatureRef.current?.on();
                setIsSignatureSaved(false);
              }}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded"
            >
              Hapus
            </button>
            <button
              type="button"
              disabled={isSignatureSaved}
              onClick={() => {
                const dataUrl = signatureRef.current
                  ?.getCanvas()
                  .toDataURL("image/png");
                if (dataUrl) {
                  onSignatureSave(dataUrl);
                  signatureRef.current?.off();
                  setIsSignatureSaved(true);
                }
                console.log(dataUrl);
              }}
              className={`px-3 py-1 text-white text-sm rounded ${
                isSignatureSaved
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600"
              }`}
            >
              Simpan Tanda Tangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDataPekerjaan;
