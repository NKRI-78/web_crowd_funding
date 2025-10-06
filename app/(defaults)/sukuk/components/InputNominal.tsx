"use client";

import { getUser } from "@/app/lib/auth";
import { fetchDashboardClient } from "@/redux/slices/dashboardSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface InputNominalLotProps {
  label?: string;
  unitPrice: number; // harga per lot
  totalUnit: number; // total lot tersedia
  minInvest: number; // minimal nominal investasi
  quota?: number; // sisa kuota IDR
  roi?: number;
  onConfirm?: (val: number) => Promise<void> | void;
}

export default function InputNominalLot({
  label = "Nominal Investasi",
  unitPrice,
  totalUnit,
  minInvest,
  quota,
  roi,
  onConfirm,
}: InputNominalLotProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: dashboardData } = useSelector(
    (state: RootState) => state.dashboard
  );

  const user = getUser();

  // ✅ cek status user
  const rekEfek = dashboardData?.rek_efek === true;
  const isInstitusi = dashboardData?.is_institusi === true;

  // 📦 state
  const [lot, setLot] = useState<number>(1);
  const [value, setValue] = useState<string>("");
  const [numericValue, setNumericValue] = useState<number>(unitPrice);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID").format(num);

  // 🔁 fetch dashboard user
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchDashboardClient(user.token));
    }
  }, [dispatch]);

  // ✅ SET lot awal: 10 jika institusi, 1 jika bukan
  useEffect(() => {
    const initialLot = isInstitusi ? 10 : 1;
    setLot(initialLot);
  }, [isInstitusi]);

  // sinkronisasi nominal ketika lot berubah
  useEffect(() => {
    const nominal = lot * unitPrice;
    setNumericValue(nominal);
    setValue(formatRupiah(nominal));
  }, [lot, unitPrice]);

  // 🔹 handle perubahan nominal manual
  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw);
    const newLot = Math.floor(numeric / unitPrice);

    if (numeric < minInvest) {
      setError(`Minimal investasi Rp${formatRupiah(minInvest)}`);
    } else if (!rekEfek && !isInstitusi && quota && numeric > quota) {
      setError(`Melebihi kuota Rp${formatRupiah(quota)}!`);
    } else if (newLot > totalUnit) {
      setError(`Maksimal ${totalUnit} lot (stok penuh)`);
    } else {
      setError(null);
      setLot(newLot);
    }

    setValue(formatRupiah(numeric));
    setNumericValue(numeric);
  };

  // 🔹 handle perubahan lot (+/-)
  const handleLotChange = (newLot: number) => {
    const nominal = newLot * unitPrice;

    if (nominal < minInvest) {
      return setError(`Minimal investasi Rp${formatRupiah(minInvest)}`);
    }
    if (!rekEfek && !isInstitusi && quota && nominal > quota) {
      return setError(`Melebihi kuota Rp${formatRupiah(quota)}!`);
    }
    if (newLot > totalUnit) {
      return setError(`Maksimal ${totalUnit} lot tersedia`);
    }

    setError(null);
    setLot(newLot);
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

  // progress bar
  const percent =
    !rekEfek && !isInstitusi && quota
      ? Math.min((numericValue / quota) * 100, 100)
      : 0;

  const sisaLot = Math.max(totalUnit - lot, 0);
  const sisaNominal = sisaLot * unitPrice;

  return (
    <div className="w-full p-5 space-y-5">
      {label && (
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}

      {/* 🔹 Flex Kiri-Kanan */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        {/* KIRI: JUMLAH LOT */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-2">Jumlah Unit</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLotChange(lot - 1)}
              disabled={lot <= (isInstitusi ? 10 : 1)}
              className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40"
            >
              −
            </button>
            <input
              type="number"
              min={isInstitusi ? 10 : 1}
              value={lot}
              onChange={(e) => handleLotChange(Number(e.target.value))}
              className="w-24 text-center border border-gray-300 rounded-lg py-2 font-semibold text-gray-900"
            />
            <button
              onClick={() => handleLotChange(lot + 1)}
              className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Total tersedia: {totalUnit.toLocaleString("id-ID")} Unit
          </p>
        </div>

        {/* KANAN: NOMINAL INVESTASI */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Nominal Investasi
          </p>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-700 font-semibold">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              disabled
              onChange={handleNominalChange}
              className={`w-full rounded-xl border pl-12 pr-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#10565C] focus:border-[#10565C] ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nominal"
            />
          </div>
        </div>
      </div>

      {/* INFO HARGA & MIN INVEST */}
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
        <div className="flex justify-between">
          <span>Harga per Unit</span>
          <span className="font-medium text-gray-800">
            Rp{formatRupiah(unitPrice)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Minimal Investasi</span>
          <span className="font-medium text-gray-800">
            Rp{formatRupiah(minInvest)}
          </span>
        </div>
      </div>

      {/* PROGRESS KUOTA */}
      {!rekEfek && !isInstitusi && quota && (
        <div className="space-y-2 mt-3">
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
          <p className="text-xs text-gray-500 text-right">
            Sisa Kuota: {sisaLot} Lot — Rp{formatRupiah(sisaNominal)}
          </p>
        </div>
      )}

      {/* STATUS USER */}
      {rekEfek && (
        <p className="text-sm text-green-600 font-medium">
          Rekening Efek Terverifikasi — investasi tanpa batas kuota.
        </p>
      )}
      {/* {isInstitusi && (
        <p className="text-sm text-green-600 font-medium">
          Pemodal Perusahaan Terverifikasi — investasi tanpa batas kuota.
        </p>
      )} */}

      {/* ROI */}
      {roi && (
        <div className="text-center bg-green-50 border border-green-200 p-3 rounded-lg">
          <p className="text-xs text-green-700 font-medium">
            Estimasi ROI {roi}%
          </p>
          <p className="text-lg font-bold text-green-700">
            Rp{formatRupiah((numericValue * roi) / 100)}
          </p>
        </div>
      )}

      {/* DISCLAIMER */}
      <section className="bg-white text-black">
        <h2 className="text-md font-bold text-center mb-3">DISCLAIMER</h2>
        <div className="max-h-[120px] overflow-y-scroll p-2 border border-gray-300 rounded-lg text-justify text-sm leading-relaxed">
          <p>
            Keputusan investasi sepenuhnya ada di tangan Anda. Kami tidak
            bertanggung jawab atas kerugian dari investasi ini. Pemodal memahami
            bahwa pembagian dividen tidak bersifat lifetime dan dapat berubah
            sesuai kebijakan penerbit.
          </p>
        </div>
      </section>

      {/* CHECKBOX */}
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

      {/* TOMBOL KONFIRMASI */}
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

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
