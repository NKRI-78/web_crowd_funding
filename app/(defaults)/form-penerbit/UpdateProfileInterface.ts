export interface ProfileUpdate {
  form: string;
  id: string;
  fullname: string;
  avatar: string;
  last_education: string;
  gender: string;
  status_marital: string;
  address_detail: string;
  occupation: string;
  company: {
    id: string;
    name: string;
    nib: string;
    nib_path: string;
    akta_pendirian: string;
    akta_perubahan_terahkir: string;
    sk_kumham: string;
    sk_kumham_terahkir: string;
    sk_kumham_path: string;
    npwp_path: string;
    total_employees: number;
    laporan_keuangan_path: string;
    rekening_koran: string;
    address: CompanyAddress[];
    directors: CompanyPerson[];
    komisaris: CompanyPerson[];
    projects: CompanyProject[];
  };
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface CompanyAddress {
  name: string;
  detail: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  postal_code: string;
}

export interface CompanyPerson {
  id: number;
  title: string;
  name: string;
  position: string;
  ktp: string;
  ktp_path: string;
  npwp: string;
  npwp_path: string;
}

export interface CompanyProject {
  id: string;
  title: string;
  jenis_obligasi: string;
  jumlah_minimal: number;
  jangka_waktu: string;
  tingkat_bunga: string;
  company_profile: string;
  jadwal_pembayaran_bunga: string;
  jadwal_pembayaran_pokok: string;
  deskripsi_pekerjaan: string;
  media: MediaItem[];
  jaminan_kolateral: NamedItem[];
  penggunaan_dana: NamedItem[];
  nilai_kontrak_path: string;
  nilai_kontrak: string;
  is_apbn: boolean;
}

export interface MediaItem {
  id: number;
  path: string;
}

export interface NamedItem {
  id: number;
  name: string;
}

export const publisherUpdateKeys: string[] = [
  "nama-perusahaan",
  "nib",
  "akta-pendirian-perusahaan",
  "sk-kumham-path",
  "akta-perubahan-terakhir",
  "sk-kumham-terakhir",
  "alamat-perusahaan",
  "alamat-korespondensi",
  "jumlah-karyawan",
];

export const penerbitUpdateKeys: string[] = [
  "laporan-keuangan",
  "rekening-koran",
  "susunan-manajemen",
  "{index}-direktur-nama",
  "{index}-direktur-jabatan",
  "{index}-direktur-no-ktp",
  "{index}-direktur-upload-ktp",
  "{index}-direktur-upload-npwp",
  "{index}-komisaris-nama",
  "{index}-komisaris-jabatan",
  "{index}-komisaris-no-ktp",
  "{index}-komisaris-upload-ktp",
  "{index}-komisaris-upload-npwp",
  "foto-proyek",
  "title-proyek",
  "jenis-obligasi",
  "nilai-nominal",
  "jangka-waktu",
  "tingkat-bunga",
  "jadwal-pembayaran-bunga",
  "jadwal-pembayaran-pokok",
  "penggunaan-dana",
  "jaminan-kolateral",
  "deskripsi-pekerjaan",
  "biaya-apbn-apbd",
  "no-kontrak",
  "doc-kontrak",
  "company-profile",
];
