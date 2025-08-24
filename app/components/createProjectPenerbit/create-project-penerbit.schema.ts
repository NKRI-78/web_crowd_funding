import z from "zod";

export const alamatSchema = z.object({
  name: z.string().optional(),
  province_name: z.string(),
  city_name: z.string().min(1, "Kota wajib diisi"),
  district_name: z.string().min(1, "Kecamatan wajib diisi"),
  subdistrict_name: z.string().min(1, "Kelurahan wajib diisi"),
  postal_code: z.string().min(1, "Kode pos wajib diisi"),
  detail: z.string().min(1, "Detail alamat wajib diisi"),
});

export interface ProjectTypeInterface {
  id: string;
  name: string;
}

const mapsResultSchema = z.object({
  lat: z.number().min(1, "Latitude wajib ada"),
  lng: z.number().min(1, "Longitude wajib ada"),
  url: z.string().url(),
  address: z.string().min(1, "address wajib diisi"),
  components: z.record(z.string().optional()),
});

export const createProjectPenerbitSchema = z
  .object({
    namaProyek: z.string().min(1, "Nama Proyek tidak boleh kosong"),
    deskripsiProyek: z.string().min(1, "Deskripsi Proyek tidak boleh kosong"),
    jenisProyek: z.string().min(1, "Jenis Proyek wajib dipilih"),
    tenor: z.string().min(1, "Tenor Pinjaman wajib dipilih"),
    tanggalMulaiProyek: z.string().min(1, "Tanggal Mulai Proyek wajib dipilih"),
    tanggalSelesaiProyek: z
      .string()
      .min(1, "Tanggal Selesai Proyek wajib dipilih"),
    jaminanKolateral: z
      .array(z.string())
      .min(1, "Jaminan Kolateral wajib dipilih"),
    persentaseKeuntungan: z
      .number({
        required_error: "Persentase Keuntungan wajib diisi",
        invalid_type_error: "Persentase Keuntungan harus berupa angka",
      })
      .min(10, "Minimal 10%")
      .max(100, "Maksimal 100%"),
    modalProyek: z
      .number({
        required_error: "Modal Proyek wajib diisi",
        invalid_type_error: "Modal Proyek harus berupa angka",
      })
      .min(100_000_000, "Minimal Rp100.000.000")
      .max(10_000_000_000, "Maksimal Rp10.000.000.000"),
    fotoProyek: z
      .array(z.string().url())
      .min(1, "Foto Proyek wajib diupload minimal 1 foto"),
    instansiProyek: z
      .string()
      .min(1, "Instansi Pemberi Proyek tidak boleh kosong"),
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
    lokasiProyek: mapsResultSchema.nullable(),
  })
  .refine((data) => data.lokasiProyek !== null, {
    message: "Lokasi Proyek wajib diisi",
    path: ["lokasiProyek"],
  });

export const defaultValues: CreateProjectFormSchema = {
  namaProyek: "",
  deskripsiProyek: "",
  jenisProyek: "",
  tenor: "",
  tanggalMulaiProyek: "",
  tanggalSelesaiProyek: "",
  jaminanKolateral: [],
  modalProyek: 0,
  persentaseKeuntungan: 0,
  fotoProyek: [],
  instansiProyek: "",
  jenisInstansiProyek: "",
  websiteInstansiProyek: "",
  fileSPK: "",
  fileLOA: "",
  dokumenKontrak: "",
  rekeningKoran: "",
  laporanKeuangan: "",
  prospektus: "",
  lokasiProyek: null,
};

export type CreateProjectFormSchema = z.infer<
  typeof createProjectPenerbitSchema
>;
