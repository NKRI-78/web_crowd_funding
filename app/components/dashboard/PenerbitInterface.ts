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

export interface EmitenProjectModel {
  id: string;
  title: string;
  goal: string;
  medias: Media[];
  location: Location;
  doc: Document;
  capital: string;
  roi: string;
  min_invest: string;
  unit_price: string;
  unit_total: string;
  number_of_unit: string;
  periode: string;
  type_of_bond: string;
  nominal_value: string;
  time_periode: string;
  interest_rate: string;
  interest_payment_schedule: string;
  principal_payment_schedule: string;
  use_of_funds: FundUse[];
  collateral_guarantee: CollateralGuarantee[];
  desc_job: string;
  is_apbn: boolean;
  is_approved: boolean;
  company: Company;
  created_at: string;
  updated_at: string;
  jenis_projek: string;
  jumlah_minimal: string;
  jangka_waktu: string;
  tingkat_bunga: string;
}
