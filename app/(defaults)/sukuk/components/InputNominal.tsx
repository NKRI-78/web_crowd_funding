"use client";

import { getUser } from "@/app/lib/auth";
import { fetchDashboardClient } from "@/redux/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface InputNominalProps {
  label?: string;
  placeholder?: string;
  minValue?: number;
  quota?: number; // 🔹 Kuota maksimal investasi
  onConfirm?: (val: number) => Promise<void> | void;
}

export default function InputNominal({
  label = "Nominal Investasi",
  placeholder = "Masukkan jumlah investasi",
  minValue = 0,
  quota,
  onConfirm,
}: InputNominalProps) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [numericValue, setNumericValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data: dashboardData } = useSelector(
    (state: RootState) => state.dashboard
  );

  const user = getUser();

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchDashboardClient(user.token));
    }
  }, [dispatch]);

  // ✅ Cek apakah user sudah punya Rekening Efek
  const rekEfek = dashboardData?.rek_efek === true;
  const isInstitusi = dashboardData?.is_institusi === true;

  // format angka ke Rupiah style (1.000.000)
  const formatRupiah = (num: string) => {
    if (!num) return "";
    return new Intl.NumberFormat("id-ID").format(
      Number(num.replace(/\D/g, ""))
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numeric = Number(rawValue);
    const formatted = formatRupiah(rawValue);

    if (minValue > 0 && numeric < minValue) {
      setError(`Minimal investasi Rp${minValue.toLocaleString("id-ID")}`);
    } else if (!rekEfek && !isInstitusi && quota && numeric > quota) {
      // ✅ hanya validasi quota kalau rek_efek = false
      setError(`Maksimal investasi Rp${quota.toLocaleString("id-ID")} (kuota)`);
    } else {
      setError(null);
    }

    setValue(formatted);
    setNumericValue(numeric);
  };

  const handleConfirm = async () => {
    if (!error && onConfirm) {
      try {
        setLoading(true);
        await onConfirm(numericValue);
      } finally {
        setLoading(false);
      }
    }
  };

  // progress bar calculation
  const percent =
    !rekEfek && !isInstitusi && quota
      ? Math.min((numericValue / quota) * 100, 100)
      : 0;

  return (
    <div className="w-full p-5 space-y-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}

      {/* Input Nominal */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-700 font-semibold">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          className={`w-full rounded-xl border pl-12 pr-4 py-4 text-md font-semibold text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#10565C] focus:border-[#10565C] placeholder:font-medium ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Kuota Info */}
      {!rekEfek && !isInstitusi && quota && (
        <div className="space-y-2">
          <span className="block text-sm font-semibold text-gray-800">
            Kuota Investasi
          </span>
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              Rp{numericValue.toLocaleString("id-ID")} / Rp
              {quota.toLocaleString("id-ID")}
            </span>
            <span>{percent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${
                percent >= 100 ? "bg-red-500" : "bg-[#10565C]"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {rekEfek && (
        <p className="text-sm text-green-600 font-medium">
          Rekening Efek Terverifikasi — investasi tanpa batas kuota.
        </p>
      )}

      {isInstitusi && (
        <p className="text-sm text-green-600 font-medium">
          Pemodal Perusahaan Terverifikasi — investasi tanpa batas kuota.
        </p>
      )}

      {/* Disclaimer */}
      <section className="bg-white text-black">
        <h2 className="text-md relative font-bold text-center mb-4">
          DISCLAIMER
        </h2>
        <div className="max-h-[120px] overflow-y-scroll p-2 border border-gray-300 rounded-lg text-justify text-sm leading-relaxed">
          <p>
            “Keputusan terkait investasi sepenuhnya ada di tangan Anda. Kami
            tidak bertanggung jawab atas kerugian atas investasi ini.” Pemodal
            mengerti dan memahami bahwa pembagian dividen kepada para pemegang
            Efek tidak bersifat lifetime karena Penerbit merupakan badan usaha
            berbadan hukum berhak melakukan Buyback sebagaimana diatur dalam
            akta anggaran dasar Penerbit dan peraturan perundang-undangan yang
            berlaku.
          </p>
        </div>
      </section>

      {/* Checkbox Persetujuan */}
      <div className="flex items-center gap-2">
        <input
          id="agree"
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="h-4 w-4 text-[#10565C] border-gray-300 rounded"
        />
        <label htmlFor="agree" className="text-sm text-gray-700">
          Saya sudah membaca dan menyetujui disclaimer di atas.
        </label>
      </div>

      {/* Tombol Konfirmasi */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!numericValue || !!error || !checked || loading}
        className={`w-full py-4 rounded-xl text-white font-semibold text-base 
          transition flex items-center justify-center gap-2
          ${
            !numericValue || !!error || !checked || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#10565C] hover:bg-[#0d474f]"
          }`}
      >
        {loading ? (
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading...
          </>
        ) : (
          "Konfirmasi Investasi"
        )}
      </button>
    </div>
  );
}
