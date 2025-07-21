import { useEffect, useState } from "react";

interface JobStructureFormData {
  id: string;
  title: string;
  nama: string;
  jabatan: string;
  noKTP: string;
  fileKTP: string;
  fileNPWP: string;
}

interface FormPenerbitState {
  laporanKeuangan: string;
  susunanManajemen: JobStructureFormData[];
  fotoProyek: string;
  titleProyek: string;
  nilaiNominal: string;
  jenisObligasi: string;
  jangkaWaktu: string;
  tingkatBunga: string;
  jadwalBunga: string;
  jadwalPokok: string;
  penggunaanDana: string;
  jaminanKolateral: string;
  deskripsiPekerjaan: string;
  jenisBiaya: string;
  companyProfile: string;
}

export function useFormPenerbit() {
  const [state, setState] = useState<FormPenerbitState>({
    laporanKeuangan: "",
    susunanManajemen: [
      {
        title: "Komisaris",
        fileKTP: "",
        jabatan: "Komisaris",
        id: "komisaris",
        fileNPWP: "",
        nama: "",
        noKTP: "",
      },
      {
        title: "Direksi",
        fileKTP: "",
        jabatan: "Direksi",
        id: "direksi",
        fileNPWP: "",
        nama: "",
        noKTP: "",
      },
    ],
    fotoProyek: "",
    titleProyek: "",
    nilaiNominal: "",
    jenisObligasi: "konvensional",
    jangkaWaktu: "6 Bulan",
    tingkatBunga: "10",
    jadwalBunga: "1 Bulan",
    jadwalPokok: "1 Bulan",
    penggunaanDana: "Modal Usaha",
    jaminanKolateral: "Tanah Bangunan",
    deskripsiPekerjaan: "",
    jenisBiaya: "Tidak",
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

  const updateSusunanManajemen = (
    id: string,
    field: keyof JobStructureFormData,
    updated: string
  ) => {
    setState((prev) => ({
      ...prev,
      susunanManajemen: prev.susunanManajemen.map((item) =>
        item.id === id ? { ...item, [field]: updated } : item
      ),
    }));
  };

  const addSusunanManajemen = (title: string) => {
    const newId = `${title.toLowerCase()}-${Date.now()}`;
    const newStructure: JobStructureFormData = {
      id: newId,
      title,
      nama: "",
      jabatan: title,
      noKTP: "",
      fileKTP: "",
      fileNPWP: "",
    };
    setState((prev) => ({
      ...prev,
      susunanManajemen: [...prev.susunanManajemen, newStructure],
    }));
  };

  const removeSusunanManajemen = (id: string) => {
    setState((prev) => ({
      ...prev,
      susunanManajemen: prev.susunanManajemen.filter((s) => s.id !== id),
    }));
  };

  return {
    formState: state,
    updateField,
    updateSusunanManajemen,
    addSusunanManajemen,
    removeSusunanManajemen,
  };
}
