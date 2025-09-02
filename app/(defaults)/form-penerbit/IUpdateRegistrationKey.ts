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

export const penerbitPICUpdateKeys: string[] = ["surat-kuasa", "ktp"];

export const penerbitUpdateKeys: string[] = [
  "sk-kumham-terakhir",
  "siup",
  "tdp",
  "npwp",
  "nib",
  "akta-pendirian-perusahaan",
  "sk-kumham-pendirian",
  "akta-perubahan-terakhir",
  "laporan-keuangan",
  "rekening-koran",

  "0-direktur-upload-ktp",
  "0-direktur-upload-npwp",

  "1-direktur-upload-ktp",
  "1-direktur-upload-npwp",

  "2-direktur-upload-ktp",
  "2-direktur-upload-npwp",

  "0-komisaris-upload-ktp",
  "0-komisaris-upload-npwp",

  "1-komisaris-upload-ktp",
  "1-komisaris-upload-ktp",

  "2-komisaris-upload-npwp",
  "2-komisaris-upload-npwp",
];
