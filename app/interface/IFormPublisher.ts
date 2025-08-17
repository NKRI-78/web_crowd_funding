export interface IFormPublisher {
  sameAsCompany: boolean;
  total_employees: string;
  jenis_usaha: string;
  company_nib_path: string;
  akta_pendirian: string;
  sk_kumham_path: string;
  akta_perubahan_terahkir_path: string;
  sk_kumham_terahkir: string;
  fileNpwp: string;
  siup: string;
  tdp: string;
  noPhoneCompany: string;
  webCompany: string;
  emailCompany: string;
  namaBank: string;
  nomorRekening: string;
  namaPemilik: string;
  establishedYear: string;
  address: Address[];
  company_name: string;
  companyType: string;
  statusCompanys: string;
}

export interface Address {
  name: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  postal_code: string;
  detail: string;
}
