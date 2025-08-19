import z from "zod";

export const createProjectPenerbitSchema = z.object({
  namaProyek: z.string().min(1, "Nama Proyek tidak boleh kosong"),
  deskripsiProyek: z.string().min(1, "Deskripsi Proyek tidak boleh kosong"),
  jenisProyek: z.string().min(1, "Jenis Proyek wajib dipilih"),
  tenor: z.string().min(1, "Tenor Pinjaman wajib dipilih"),
  batasAkhirPengerjaan: z.string().min(1, "Tanggal Proyek wajib dipilih"),
  jaminanKolateral: z
    .array(z.string())
    .min(1, "Jaminan Kolateral wajib dipilih"),
  persentaseKeuntungan: z
    .string()
    .min(1, "Persentase Keuntungan wajib dipilih"),
  modalProyek: z
    .number({
      required_error: "Modal Proyek wajib diisi",
      invalid_type_error: "Modal Proyek harus berupa angka",
    })
    .min(10_000_000, "Minimal Rp10.000.000")
    .max(10_000_000_000, "Maksimal Rp10.000.000.000"),
  fotoProyek: z
    .array(z.string().url())
    .min(1, "Foto Proyek wajib diupload minimal 1 foto"),
  jenisInstansiProyek: z
    .string()
    .min(1, "Jenis Instansi Proyek tidak boleh kosong"),
  websiteInstansiProyek: z.string().url("Url Website tidak valid"),
  fileSPK: z.string().min(1, "File SPK wajib diupload"),
  fileLOA: z.string().min(1, "File LOA wajib diupload"),
  dokumenKontrak: z.string().min(1, "Dokumen Kontrak wajib diupload"),
  rekeningKoran: z.string().min(1, "Rekening Koran wajib diupload"),
  laporanKeuangan: z.string().min(1, "Laporan Keuangan wajib diupload"),
  prospektus: z.string().min(1, "Prospektus wajib diupload"),
});

export const defaultValues: CreateProjectFormSchema = {
  namaProyek: "",
  deskripsiProyek: "",
  jenisProyek: "",
  tenor: "",
  batasAkhirPengerjaan: "",
  jaminanKolateral: [],
  persentaseKeuntungan: "",
  modalProyek: 0,
  fotoProyek: [],
  jenisInstansiProyek: "",
  websiteInstansiProyek: "",
  fileSPK: "",
  fileLOA: "",
  dokumenKontrak: "",
  rekeningKoran: "",
  laporanKeuangan: "",
  prospektus: "",
};

export type CreateProjectFormSchema = z.infer<
  typeof createProjectPenerbitSchema
>;
