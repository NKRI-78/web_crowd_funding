export interface UserProfile {
  fullname: string;
  avatar: string;
  last_education: string;
  gender: string;
  status_marital: string;
  address_detail: string;
  occupation: string;
  selfie: string;
  position: string;
  verify_emiten: boolean;
  company: {
    name: string;
    projects: Project[];
  };
}

export interface Project {
  id: string;
  title: string;
  deskripsi: string;
  jenis_projek: string;
  spk: string;
  loa: string;
  mulai_project: string;
  selesai_project: string;
  media: {
    id: number;
    path: string;
  }[];
  jaminan_kolateral: {
    id: number;
    name: string;
  }[];
  status: ProjectStatus;
}

export type ProjectStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "PUBLISH"
  | "UNPAID";
