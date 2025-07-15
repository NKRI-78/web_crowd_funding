interface ApiResponse {
  status: number;
  error: boolean;
  message: string;
  data: Project[];
}

interface Project {
  id: string;
  title: string;
  goal: string;
  medias: ProjectMedia[];
  location: ProjectLocation;
  doc: Document;
  capital: string;
  roi: string;
  min_invest: string;
  unit_price: string;
  unit_total: string;
  number_of_unit: string;
  periode: string;
  jangkaWaktu: string;
  danaTerkumpul: string;
  minimalInvestasi: string;
  kebutuhanModal: string;
  proyeksiROI: string;
  created_at: string;
  updated_at: string;
}

interface ProjectMedia {
  id: number;
  path: string;
}

interface ProjectLocation {
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
