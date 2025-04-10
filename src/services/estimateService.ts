
import { estimateService as supabaseEstimateService } from "./SupabaseEstimateService";
import { Estimate, EstimateItem, NewEstimate } from "@/models/Estimate";

// This file exists only for backward compatibility
// It re-exports the actual implementation methods from SupabaseEstimateService
// so that existing code doesn't break during the transition to the new architecture

export const getEstimates = (): Promise<Estimate[]> => {
  return supabaseEstimateService.getEstimates();
};

export const getEstimate = (id: string): Promise<Estimate | undefined> => {
  return supabaseEstimateService.getEstimate(id);
};

export const createEstimate = (estimate: NewEstimate): Promise<Estimate> => {
  return supabaseEstimateService.createEstimate(estimate);
};

export const updateEstimate = (id: string, updatedEstimate: Partial<Estimate>): Promise<Estimate | null> => {
  return supabaseEstimateService.updateEstimate(id, updatedEstimate);
};

export const deleteEstimate = (id: string): Promise<boolean> => {
  return supabaseEstimateService.deleteEstimate(id);
};

export const calculateEstimateTotals = (items: EstimateItem[], taxRate: number) => {
  return supabaseEstimateService.calculateEstimateTotals(items, taxRate);
};
