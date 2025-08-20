// utils/strict-npwp.ts
export type NPWPResult = { isNPWP: boolean; npwp: string | null; reason?: any };

const RX_LABEL_NPWP = /N[\s:\-]*P[\s:\-]*W[\s:\-]*P/i;
const RX_TAXWORDS =
  /(DIREKTORAT\s+JENDERAL\s+PAJAK|KEMENTERIAN\s+KEUANGAN|WAJIB\s+PAJAK|DJP)/i;
const RX_KTPWORDS =
  /(KARTU\s+TANDA\s+PENDUDUK|NIK\b|PROVINSI|KABUPATEN|KECAMATAN|KELURAHAN|AGAMA|BERLAKU\s+HINGGA|RT\/RW)/i;

const ANY_DASH = /[\u2010\u2011\u2012\u2013\u2014\u2212\-]/g; // semua dash

function normalize(s: string) {
  return (s || "")
    .replace(/\u00A0/g, " ") // NBSP → spasi
    .replace(/[\u2000-\u200A\u202F\u205F\u3000]/g, " ")
    .replace(/\s+/g, " ") // semua whitespace → 1 spasi
    .replace(ANY_DASH, "-") // seragamkan dash
    .replace(/[•·,]/g, ".") // bullet/comma → titik
    .replace(/[Oo]/g, "0")
    .replace(/[Il]/g, "1")
    .replace(/B/g, "8")
    .toUpperCase()
    .trim();
}

function fmt15(d: string) {
  const x = d.slice(0, 15);
  return `${x.slice(0, 2)}.${x.slice(2, 5)}.${x.slice(5, 8)}.${x.slice(
    8,
    9
  )}-${x.slice(9, 12)}.${x.slice(12, 15)}`;
}
function fmt16(d: string) {
  const x = d.slice(0, 16);
  return `${x.slice(0, 2)}.${x.slice(2, 5)}.${x.slice(5, 8)}.${x.slice(
    8,
    9
  )}-${x.slice(9, 12)}.${x.slice(12, 16)}`;
}

export function classifyFromTesseractText(text: string): NPWPResult {
  const T = normalize(text);

  const hasLabel = RX_LABEL_NPWP.test(T);
  const hasTax = RX_TAXWORDS.test(T);
  const ktpLike = RX_KTPWORDS.test(T);

  // cari "run" yang terdiri dari digit + pemisah (. - spasi)
  const RUN_RX = /[0-9](?:[0-9.\- ]){10,}[0-9]/g;
  const cands: {
    digits: string;
    raw: string;
    len: number;
    hasSep: boolean;
    score: number;
  }[] = [];

  let m: RegExpExecArray | null;
  while ((m = RUN_RX.exec(T))) {
    const raw = m[0];
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 15 || digits.length > 16) continue;
    const len = digits.length;
    const hasSep = /[.\- ]/.test(raw);
    // skoring: format lama (15 + ada separator) diutamakan
    let score = 0;
    if (len === 15) score += 5;
    if (hasSep) score += 3;
    if (hasLabel) score += 3;
    if (hasTax) score += 2;
    if (len === 16 && ktpLike) score -= 6; // penalti untuk pola mirip NIK saat konteks KTP
    cands.push({ digits, raw, len, hasSep, score });
  }

  if (!cands.length)
    return { isNPWP: false, npwp: null, reason: "no-candidate" };

  cands.sort((a, b) => b.score - a.score);
  const best = cands[0];

  // hard reject: kalau konteks KTP kuat & tidak ada sinyal NPWP sama sekali
  if (!hasLabel && !hasTax && ktpLike) {
    return {
      isNPWP: false,
      npwp: null,
      reason: { cause: "ktp-context", best },
    };
  }

  const pretty = best.len === 16 ? fmt16(best.digits) : fmt15(best.digits);
  return {
    isNPWP: true,
    npwp: pretty,
    reason: { best, hasLabel, hasTax, ktpLike },
  };
}
