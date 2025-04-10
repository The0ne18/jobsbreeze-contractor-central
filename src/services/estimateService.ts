
import { Estimate, EstimateItem, NewEstimate } from "@/models/Estimate";
import { v4 as uuidv4 } from "uuid";

// Mock data store
let estimates: Estimate[] = [
  {
    id: "1",
    clientId: "c1",
    clientName: "John Smith",
    status: "draft",
    date: new Date(2025, 3, 7), // April 7th, 2025
    expirationDate: new Date(2025, 4, 7), // May 7th, 2025
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: "",
    terms: "Net 30",
    createdAt: new Date(2025, 3, 7)
  }
];

export const getEstimates = (): Promise<Estimate[]> => {
  return Promise.resolve([...estimates]);
};

export const getEstimate = (id: string): Promise<Estimate | undefined> => {
  const estimate = estimates.find(e => e.id === id);
  return Promise.resolve(estimate);
};

export const createEstimate = (estimate: NewEstimate): Promise<Estimate> => {
  const newEstimate: Estimate = {
    id: uuidv4(),
    status: "draft",
    ...estimate,
    createdAt: new Date()
  };
  
  estimates.push(newEstimate);
  return Promise.resolve(newEstimate);
};

export const updateEstimate = (id: string, updatedEstimate: Partial<Estimate>): Promise<Estimate | null> => {
  const index = estimates.findIndex(e => e.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  estimates[index] = { ...estimates[index], ...updatedEstimate };
  return Promise.resolve(estimates[index]);
};

export const deleteEstimate = (id: string): Promise<boolean> => {
  const initialLength = estimates.length;
  estimates = estimates.filter(e => e.id !== id);
  
  return Promise.resolve(estimates.length < initialLength);
};

// Helper function to calculate estimate totals
export const calculateEstimateTotals = (items: EstimateItem[], taxRate: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  return {
    subtotal,
    taxAmount,
    total
  };
};
