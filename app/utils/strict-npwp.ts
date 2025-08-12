// utils/npwp-strict.ts
const RX_LABEL_FUZZY = /N[\s:\-]*P[\s:\-]*W[\s:\-]*P/i;
const RX_TAXWORDS =
  /(DIREKTORAT\s+JENDERAL\s+PAJAK|KEMENTERIAN\s+KEUANGAN|WAJIB\s+PAJAK|NOMOR\s+POKOK\s+WAJIB\s+PAJAK)/i;

// Terima titik/koma/space campur + strip kacau
const RX_FLEX =
  /(\d{2})[.,\s]?(?:\d{3})[.,\s]?(?:\d{3})[.,\s]?(?:\d)[-\s]?(?:\d{3})[.,\s]?(?:\d{2,3})/;

// final strict tetap pakai titik & strip
const RX_STRICT = /^\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}$/;

const NORM = (s: string) =>
  s
    .replace(/[Oo]/g, "0")
    .replace(/[Il]/g, "1")
    .replace(/B/g, "8")
    .replace(/[–—−]/g, "-")
    .replace(/[•·•]/g, ".")
    .replace(/,/g, ".") // <- koma jadi titik
    .replace(/:+/g, ":") // rapikan colon
    .toUpperCase();

const fmt = (d: string) =>
  `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}.${d.slice(
    8,
    9
  )}-${d.slice(9, 12)}.${d.slice(12, 15)}`;

function pickNearLabelText(allText: string) {
  const T = NORM(allText || "");
  const i = T.search(RX_LABEL_FUZZY);
  const segs: string[] = [];
  if (i >= 0) segs.push(T.slice(Math.max(0, i - 60), i + 340)); // jendela lebih lebar
  segs.push(T);
  for (const seg of segs) {
    const m = seg.match(RX_FLEX) || seg.match(/\d{15}/);
    if (m) {
      const digits = m[0].replace(/\D/g, "");
      if (digits.length >= 15) return fmt(digits.slice(0, 15));
    }
  }
  return null;
}

export function classifyFromTesseractData(data: any) {
  const allText = (data?.text ?? "") as string;
  const hasLabel = RX_LABEL_FUZZY.test(NORM(allText));
  const hasTax = RX_TAXWORDS.test(NORM(allText));

  const candidate = pickNearLabelText(allText);
  const isStrict = candidate ? RX_STRICT.test(candidate) : false;
  const isNPWP = Boolean(candidate && (hasLabel || hasTax || isStrict));

  return {
    isNPWP,
    npwp: isNPWP ? candidate : null,
    reason: { hasLabel, hasTax, candidate, isStrict },
  };
}
