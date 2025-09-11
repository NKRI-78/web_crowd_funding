export interface Portfolio {
  project_uid: string;
  project_title: string;
  funding_status: string;
  target_amount_idr: number;
  user_paid_idr: number;
  user_pending_idr: number;
  project_paid_amount_idr: number;
  project_reserved_amount_idr: number;
}
