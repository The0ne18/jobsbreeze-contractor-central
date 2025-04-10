
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: Date;
}

export interface NewClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}
