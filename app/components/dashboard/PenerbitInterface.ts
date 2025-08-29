interface Media {
  id: number;
  path: string;
}

interface Location {
  id: number;
  name: string;
  url: string;
  lat: string;
  lng: string;
}

interface Document {
  id: string;
  path: string;
}

interface FundUse {
  id: number;
  name: string;
}

interface CollateralGuarantee {
  id: number;
  name: string;
}

interface Company {
  name: string;
}

export interface ProyekPenerbitResponse {
  id: string;
  title: string;
  deskripsi: string;
  jenis_projek: string;
  jumlah_minimal: number;
  company_profile: string;
  spk: string;
  loa: string;
  mulai_project: string;
  selesai_project: string;
  media: Media[];
  jaminan_kolateral: Media[];
  status: string;
}
