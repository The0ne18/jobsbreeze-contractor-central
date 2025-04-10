
import { Estimate, EstimateItem, NewEstimate } from "@/models/Estimate";
import { v4 as uuidv4 } from "uuid";
import { generateEstimateNumber } from "@/utils/estimateUtils";

// Mock data store
let estimates: Estimate[] = [
  {
    id: "JS-20250407-01",
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
  // Generate a formatted estimate number using client name and existing estimates
  const estimateNumber = generateEstimateNumber(estimate.clientName, estimates);
  
  const newEstimate: Estimate = {
    id: estimateNumber, // Use our formatted estimate number instead of UUID
    status: "draft",
    clientId: estimate.clientId,
    clientName: estimate.clientName,
    date: estimate.date,
    expirationDate: estimate.expirationDate,
    items: estimate.items,
    subtotal: estimate.subtotal,
    taxRate: estimate.taxRate,
    taxAmount: estimate.taxAmount,
    total: estimate.total,
    notes: estimate.notes,
    terms: estimate.terms,
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
