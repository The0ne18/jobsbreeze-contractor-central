
import { Client, NewClient } from "@/models/Client";
import { v4 as uuidv4 } from "uuid";

// Mock data store
let clients: Client[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 90210",
    notes: "Reliable customer, prefers communication via text",
    createdAt: new Date(2023, 10, 15)
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, Somewhere, CA 94103",
    notes: "Has two rental properties that need regular maintenance",
    createdAt: new Date(2023, 11, 3)
  },
  {
    id: "c3",
    name: "Robert Chen",
    email: "robert.chen@example.com",
    phone: "(555) 456-7890",
    address: "789 Pine St, Nowhere, CA 92101",
    createdAt: new Date(2024, 0, 20)
  }
];

export const getClients = (): Promise<Client[]> => {
  return Promise.resolve([...clients]);
};

export const getClient = (id: string): Promise<Client | undefined> => {
  const client = clients.find(c => c.id === id);
  return Promise.resolve(client);
};

export const createClient = (client: NewClient): Promise<Client> => {
  const newClient: Client = {
    id: uuidv4(),
    ...client,
    createdAt: new Date()
  };
  
  clients.push(newClient);
  return Promise.resolve(newClient);
};

export const updateClient = (id: string, updatedClient: Partial<Client>): Promise<Client | null> => {
  const index = clients.findIndex(c => c.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  clients[index] = { ...clients[index], ...updatedClient };
  return Promise.resolve(clients[index]);
};

export const deleteClient = (id: string): Promise<boolean> => {
  const initialLength = clients.length;
  clients = clients.filter(c => c.id !== id);
  
  return Promise.resolve(clients.length < initialLength);
};
