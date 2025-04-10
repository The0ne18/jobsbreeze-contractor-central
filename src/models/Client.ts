
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface NewClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  user_id: string;
}
