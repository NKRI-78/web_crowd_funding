"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Copy,
  FileUp,
  FileText,
  Upload,
  X,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { formatRupiah } from "@/app/utils/formatRupiah";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BACKEND, API_BACKEND_MEDIA } from "@/app/utils/constant";
import Swal from "sweetalert2";
import { getUser } from "@/app/lib/auth";
import DetailPembayaran from "./components/DetailPembayaran";

/* =========================
 *  VALIDASI FILE (Zod) — hanya file
 * ========================= */
const ACCEPT_TYPES = ["image/jpeg", "image/png"] as const;
type AcceptType = (typeof ACCEPT_TYPES)[number];
const isAcceptType = (t: string): t is AcceptType =>
  (ACCEPT_TYPES as readonly string[]).includes(t);

const MAX_SIZE_MB = 5;

const proofSchema = z
  .custom<File>((v) => v instanceof File, {
    message: "File bukti wajib diunggah.",
  })
  .refine((file) => isAcceptType(file.type), {
    message: "Tipe file tidak didukung (JPG/PNG).",
  })
  .refine((file) => file.size <= MAX_SIZE_MB * 1024 * 1024, {
    message: `Ukuran file maksimal ${MAX_SIZE_MB}MB.`,
  });

const schema = z.object({ proof: proofSchema });
type FormValues = z.infer<typeof schema>;

/* =========================
 *  TIPE DETAIL PEMBAYARAN
 * ========================= */
type PaymentItem = {
  id: number;
  template_name: string;
  calculated_amount: number;
  template_description?: string;
};
type PaymentDetail = {
  info: PaymentItem[];
  total_amount: number;
};

/* =========================
 *  PROPS
 * ========================= */
type Props = {
  bankName?: string;
  accountNumber?: string;
  accountOwner?: string;
  logoSrc?: string;
  /** opsional: string dari API berformat seperti contohmu:
   * { "data": "{\"info\":[...],\"total_amount\":20000000}" }
   * pass aja `paymentDetailString = that.data`
   */
  paymentDetailString?: string | null;
};

export default function PembayaranBCAWithDetail({
  bankName = "Bank BCA",
  accountNumber = "2443 24234 2343",
  accountOwner = "PT Fulusme",
  logoSrc = "/images/bank/bca-logo.png",
  paymentDetailString = '{"info": [{"id": 190, "percentage": 1, "project_id": "3dae18d8-114d-448c-8a7d-26227142a29f", "template_id": 8, "fixed_amount": 0, "template_name": "Registrasi Fee", "calculated_amount": 10000000, "template_description": "1% Subject to minimum 10 Juta"}, {"id": 191, "percentage": 0, "project_id": "3dae18d8-114d-448c-8a7d-26227142a29f", "template_id": 9, "fixed_amount": 10000000, "template_name": "Deposit Notaris", "calculated_amount": 10000000, "template_description": "Uang kembali jika proyek Anda tidak tervalidasi"}, {"id": 192, "percentage": 0, "project_id": "3dae18d8-114d-448c-8a7d-26227142a29f", "template_id": 10, "fixed_amount": 0, "template_name": "Platform Fee", "calculated_amount": 0, "template_description": "Platform fee dapat didiskusikan dengan team Fulusme"}], "total_amount": 20000000}',
}: Props) {
  /* ----------------- state umum ----------------- */
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const searchParams = useSearchParams();
  const inboxId = searchParams.get("inboxId");
  const priceParam = Number(searchParams.get("price") || "0") || 0;

  /* ----------------- parse detail pembayaran ----------------- */
  // Bisa juga dikirim via query ?detail=<encodeURIComponent(JSON-string)>
  const detailParam = searchParams.get("detail");
  const [detail, setDetail] = useState<PaymentDetail | null>(null);

  useEffect(() => {
    const tryParse = (raw: string | null | undefined): PaymentDetail | null => {
      if (!raw) return null;
      try {
        return JSON.parse(raw) as PaymentDetail;
      } catch {
        return null;
      }
    };

    // 1) Prioritaskan props paymentDetailString (sudah berupa JSON string isi-nya)
    let parsed = tryParse(paymentDetailString || "");
    // 2) Jika tidak ada, coba ambil dari query ?detail= (URL-encoded)
    if (!parsed && detailParam) {
      try {
        parsed = JSON.parse(decodeURIComponent(detailParam)) as PaymentDetail;
      } catch {
        parsed = null;
      }
    }
    setDetail(parsed);
  }, [paymentDetailString, detailParam]);

  const totalPrice = detail?.total_amount ?? priceParam;

  /* ----------------- RHF ----------------- */
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: { proof: undefined },
  });

  const file = watch("proof");
  const isPDF = useMemo(() => file && file.type === "application/pdf", [file]);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewURL(null);
  }, [file]);

  const router = useRouter();

  /* ----------------- helpers ----------------- */
  const copyRekening = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) setValue("proof", f, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const clearFile = () => {
    setValue("proof", undefined as unknown as File, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ----------------- submit ----------------- */
  const onSubmit = async ({ proof }: FormValues) => {
    // 1) upload media
    const form = new FormData();
    form.append("folder", "web");
    form.append("subfolder", "capbridge");
    form.append("media", proof);

    const resMedia = await axios.post(
      `${API_BACKEND_MEDIA}/api/v1/media/upload`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const fileUrl = resMedia.data?.data?.path;

    // 2) simpan dokumen transaksi
    const payload = {
      path: fileUrl,
      type: "transaction-payment",
      inbox_id: inboxId,
      total: totalPrice,
      bank: bankName,
      account_number: accountNumber.replace(/\s+/g, ""),
      account_owner: accountOwner,
      detail: detail ?? undefined, // kalau mau ikut kirim breakdown
    };

    const user = getUser();
    const res = await axios.post(
      `${API_BACKEND}/api/v1/document/transaction/payment`,
      payload,
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );
    if (res.status !== 200)
      throw new Error(res.statusText || "Gagal mengirim bukti pembayaran.");

    clearFile();
    reset();
    setIsUploaded(true);

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Bukti pembayaran terkirim. Terima kasih!",
      timer: 950,
      timerProgressBar: true,
    });

    router.push("/transaction");
  };

  /* ----------------- render ----------------- */
  return (
    <div className="py-28 px-4 md:py-36 flex items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-5 md:p-8">
        {/* Header bank */}
        <div className="flex items-center gap-3">
          <Image src={logoSrc} alt={bankName} width={56} height={56} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {bankName}
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Pembayaran manual
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-3">
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 1 ? "bg-[#10565C]" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 2 ? "bg-[#10565C]" : "bg-gray-200"
            }`}
          />
        </div>

        {/* STEP 1 — Info rekening + DETAIL PEMBAYARAN */}
        {step === 1 && (
          <div className="mt-6 space-y-6">
            {/* DETAIL PEMBAYARAN (breakdown) */}
            {detail && <DetailPembayaran detail={detail} />}

            {/* Kartu rekening */}
            <div className="bg-gray-50 border border-[#10565C] rounded-2xl p-5 space-y-3">
              <p className="text-gray-600">Nomor Rekening</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wide">
                {accountNumber}
              </p>
              <p className="text-gray-500">{accountOwner}</p>

              <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-[#10565C] bg-[#10565C]/5 px-4 py-3">
                <div>
                  <p className="text-xs text-gray-600">
                    Total yang harus dibayar
                  </p>
                  <p className="text-2xl font-extrabold tracking-tight text-[#10565C]">
                    {formatRupiah(totalPrice)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyRekening}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10565C] text-white hover:opacity-90 transition"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Disalin!" : "Salin Rekening"}
              </button>

              <div className="pt-3 border-t border-[#10565C]">
                <h2 className="text-base text-gray-600 md:text-lg font-semibold">
                  Cara Pembayaran
                </h2>
                <ul className="list-disc list-inside text-gray-600 text-sm md:text-[15px] space-y-1 mt-2">
                  <li>
                    Transfer via ATM, m-Banking, atau iBanking ke rekening di
                    atas.
                  </li>
                  <li>
                    Pastikan nama penerima sesuai: <b>{accountOwner}</b>.
                  </li>
                  <li>
                    Simpan bukti transfer untuk diunggah pada langkah
                    berikutnya.
                  </li>
                </ul>
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#10565C] px-4 py-2 text-white hover:opacity-90"
              >
                Upload Bukti Pembayaran
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Upload bukti + ringkasan total */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 bg-gray-50 border border-[#10565C] rounded-2xl p-5 space-y-4"
          >
            {/* Ringkasan total */}
            <div className="rounded-xl border border-[#10565C] bg-[#10565C]/5 px-4 py-3">
              <p className="text-xs text-gray-600">Total pembayaran</p>
              <p className="text-xl font-bold text-[#10565C]">
                {formatRupiah(totalPrice)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Unggah Bukti Pembayaran
              </h3>
              {file ? (
                <button
                  type="button"
                  onClick={clearFile}
                  className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              ) : null}
            </div>

            <Controller
              control={control}
              name="proof"
              render={({ field }) => (
                <label
                  onDrop={onDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOver(false);
                  }}
                  className={[
                    "relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-6 cursor-pointer transition",
                    dragOver
                      ? "border-[#10565C] bg-[#10565C]/5"
                      : "border-[#10565C] hover:bg-white",
                    field.value ? "py-4" : "py-10",
                  ].join(" ")}
                >
                  {!field.value ? (
                    <>
                      <FileUp className="mb-3 text-[#10565C]" />
                      <p className="text-center text-gray-700 font-medium">
                        Seret & letakkan file di sini
                      </p>
                      <p className="text-center text-gray-500 text-sm">
                        atau klik untuk memilih file
                      </p>
                      <p className="mt-3 text-xs text-gray-400">
                        Format: JPG, PNG • Maks {MAX_SIZE_MB}MB
                      </p>
                    </>
                  ) : (
                    <div className="w-full flex items-center gap-3">
                      {isPDF ? (
                        <div className="shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-white border border-[#10565C] flex items-center justify-center">
                            <FileText className="text-[#10565C]" />
                          </div>
                        </div>
                      ) : (
                        <div className="shrink-0">
                          <div className="relative w-16 h-16 overflow-hidden rounded-lg border border-[#10565C] bg-white">
                            {previewURL && (
                              <Image
                                src={previewURL}
                                alt={field.value.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {field.value.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(field.value.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                          {isPDF
                            ? "PDF"
                            : field.value.type
                                .replace("image/", "")
                                .toUpperCase()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearFile}
                        className="ml-auto inline-flex items-center justify-center rounded-full w-8 h-8 border border-[#10565C] hover:bg-[#10565C]/10"
                        aria-label="Hapus file"
                      >
                        <X size={16} className="text-[#10565C]" />
                      </button>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept={(ACCEPT_TYPES as readonly string[]).join(",")}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) field.onChange(f);
                    }}
                    aria-label="Pilih file bukti pembayaran"
                  />
                </label>
              )}
            />

            {errors.proof && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {errors.proof.message as string}
              </div>
            )}

            {/* NAVIGATION */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#10565C] px-4 py-2 text-[#10565C] hover:bg-[#10565C]/10"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>

              <button
                type="submit"
                disabled={!file || isSubmitting || isUploaded}
                className={[
                  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white transition",
                  !file || isSubmitting || isUploaded
                    ? "bg-[#10565C]/50 cursor-not-allowed"
                    : "bg-[#10565C] hover:opacity-90",
                ].join(" ")}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    {isUploaded ? "Sudah Terkirim" : "Submit"}
                  </>
                )}
              </button>
            </div>

            <p className="text-[13px] text-gray-500 text-center">
              Verifikasi manual oleh tim kami (≈ 1×24 jam kerja).
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
