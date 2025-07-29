import { useEffect, useState } from "react";

interface JobStructureFormData {
  id: string;
  nama: string;
  jabatan: string;
  noKTP: string;
  fileKTP: string;
  fileNPWP: string;
}

interface FormPenerbitState {
  laporanKeuangan: string;
  rekeningKoran: string;
  direktur: JobStructureFormData[];
  komisaris: JobStructureFormData[];
  fotoProyek: string[];
  titleProyek: string;
  nilaiNominal: string;
  jenisObligasi: string;
  jangkaWaktu: string;
  tingkatBunga: string;
  jadwalBunga: string;
  jadwalPokok: string;
  penggunaanDana: string[];
  jaminanKolateral: string[];
  deskripsiPekerjaan: string;
  jenisBiaya: string;
  fileDokumenKontrakApbn?: string;
  noKontrakApbn?: string;
  companyProfile: string;
}

export const maxStructure = 3;

export function useFormPenerbit() {
  const [state, setState] = useState<FormPenerbitState>({
    laporanKeuangan: "",
    rekeningKoran: "",
    direktur: [],
    komisaris: [],
    fotoProyek: [],
    titleProyek: "",
    nilaiNominal: "",
    jenisObligasi: "konvensional",
    jangkaWaktu: "6 Bulan",
    tingkatBunga: "10",
    jadwalBunga: "1 Bulan",
    jadwalPokok: "1 Bulan",
    penggunaanDana: [],
    jaminanKolateral: [],
    deskripsiPekerjaan: "",
    fileDokumenKontrakApbn: "",
    noKontrakApbn: "",
    jenisBiaya: "Iya",
    companyProfile: "",
  });

  useEffect(() => {
    const draftStr = localStorage.getItem("formPenerbitDraft");
    console.log(`draftStr ${draftStr}`);
    console.log(`getItem dipanggil`);
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        setState(draft);
      } catch (error) {
        console.error("Gagal memuat draft dari localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("formPenerbitDraft", JSON.stringify(state));
      console.log(`setItem dipanggil`);
    } catch (error) {
      console.error("Gagal menyimpan draft ke localStorage:", error);
    }
  }, [state]);

  const updateField = <K extends keyof FormPenerbitState>(
    key: K,
    value: FormPenerbitState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateDirektur = (
    id: string,
    field: keyof JobStructureFormData,
    updated: string
  ) => {
    setState((prev) => ({
      ...prev,
      direktur: prev.direktur.map((item) =>
        item.id === id ? { ...item, [field]: updated } : item
      ),
    }));
  };

  const addDirektur = () => {
    if (state.direktur.length >= maxStructure) return;
    const newId = `${Date.now()}`;
    const newDirektur: JobStructureFormData = {
      id: newId,
      nama: "",
      jabatan: state.direktur.length === 0 ? "direktur-utama" : "direktur", // default value jabatan
      noKTP: "",
      fileKTP: "",
      fileNPWP: "",
    };
    setState((prev) => ({
      ...prev,
      direktur: [...prev.direktur, newDirektur],
    }));
  };

  const removeDirektur = (id: string) => {
    setState((prev) => ({
      ...prev,
      direktur: prev.direktur.filter((s) => s.id !== id),
    }));
  };

  const updateKomisaris = (
    id: string,
    field: keyof JobStructureFormData,
    updated: string
  ) => {
    setState((prev) => ({
      ...prev,
      komisaris: prev.komisaris.map((item) =>
        item.id === id ? { ...item, [field]: updated } : item
      ),
    }));
  };

  const addKomisaris = () => {
    if (state.komisaris.length >= maxStructure) return;
    const newId = `${Date.now()}`;
    const newKomisaris: JobStructureFormData = {
      id: newId,
      nama: "",
      jabatan: state.komisaris.length === 0 ? "komisaris-utama" : "komisaris", // default value jabatan
      noKTP: "",
      fileKTP: "",
      fileNPWP: "",
    };
    setState((prev) => ({
      ...prev,
      komisaris: [...prev.komisaris, newKomisaris],
    }));
  };

  const removeKomisaris = (id: string) => {
    setState((prev) => ({
      ...prev,
      komisaris: prev.komisaris.filter((s) => s.id !== id),
    }));
  };

  return {
    formState: state,
    updateField,
    updateDirektur,
    addDirektur,
    removeDirektur,
    updateKomisaris,
    addKomisaris,
    removeKomisaris,
  };
}
