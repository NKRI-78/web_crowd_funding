// app/npwp-ocr/page.tsx
"use client";

import { cropAroundLabel } from "@/app/utils/crop-around-label";
import { classifyFromTesseractData } from "@/app/utils/strict-npwp";
import { useState } from "react";

// Preprocess sederhana di browser: resize + grayscale + threshold
async function preprocess(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("Image load error"));
  });

  // Resize biar tidak terlalu besar
  const maxW = 1600;
  const scale = Math.min(maxW / img.width, 1);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  // Grayscale + threshold
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  const thr = 165;
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const v = gray > thr ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(imgData, 0, 0);
  URL.revokeObjectURL(url);
  return canvas;
}

export default function NPWPOCR() {
  const [progress, setProgress] = useState(0);
  const [npwp, setNpwp] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProgress(0);
    setNpwp(null);
    setErr(null);

    const Tesseract = await import("tesseract.js");

    let inputForOcr: HTMLCanvasElement | File = file;
    try {
      inputForOcr = await preprocess(file); // pakai canvas hasil preprocess
    } catch {
      inputForOcr = file; // fallback ke file asli kalau preprocess gagal
    }

    async function ocr(input: HTMLCanvasElement | File, psm: "6" | "7") {
      const { data } = await Tesseract.recognize(input as any, "eng+ind", {
        logger: (m: any) => {
          if (m.status === "recognizing text" && m.progress)
            setProgress(Math.round(m.progress * 100));
        },
        tessedit_pageseg_mode: psm, // 6: block, 7: single line
        preserve_interword_spaces: "1",
        user_defined_dpi: "300",
        // minta data words+bbox lengkap
        tessjs_create_tsv: "1",
      } as any);
      return data;
    }

    try {
      // PASS 1: global
      const pass1 = await ocr(inputForOcr, "6");

      // CROP kanan label “NPWP”
      const crop = await cropAroundLabel(
        inputForOcr as HTMLCanvasElement,
        pass1
      );

      // PASS 2: hanya area crop, fokus single-line
      let mergedText = pass1.text || "";
      if (crop) {
        const pass2 = await ocr(crop, "7");
        mergedText += "\n" + (pass2.text || "");
      }

      // KLASIFIKASI
      const check = classifyFromTesseractData({ text: mergedText });
      if (!check.isNPWP) {
        setErr("NPWP belum terdeteksi.");
      } else {
        setErr(null);
        setNpwp(check.npwp!);
      }
    } catch (e: any) {
      setErr(e?.message ?? "OCR gagal.");
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <input type="file" accept="image/*" onChange={onFile} />
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className="h-2 rounded"
          style={{ width: `${progress}%`, background: "#0ea5e9" }}
        />
      </div>
      <div className="text-sm">Progress: {progress}%</div>

      <div className="border p-3 rounded text-sm">
        <div>
          <b>NPWP:</b> {npwp ?? "—"}
        </div>
        {err && <div className="text-red-600 mt-2">{err}</div>}
      </div>
    </div>
  );
}
