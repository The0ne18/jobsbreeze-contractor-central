
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface NewClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  user_id: string;
}
