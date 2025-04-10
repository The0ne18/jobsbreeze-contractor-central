
import { Estimate, EstimateItem, NewEstimate } from "@/models/Estimate";

/**
 * Interface for estimate service operations
 */
export interface IEstimateService {
  /**
   * Get all estimates
   */
  getEstimates(): Promise<Estimate[]>;
  
  /**
   * Get a specific estimate by ID
   */
  getEstimate(id: string): Promise<Estimate | undefined>;
  
  /**
   * Create a new estimate
   */
  createEstimate(estimate: NewEstimate): Promise<Estimate>;
  
  /**
   * Update an existing estimate
   */
  updateEstimate(id: string, updatedEstimate: Partial<Estimate>): Promise<Estimate | null>;
  
  /**
   * Delete an estimate
   */
  deleteEstimate(id: string): Promise<boolean>;
  
  /**
   * Calculate estimate totals based on items and tax rate
   */
  calculateEstimateTotals(items: EstimateItem[], taxRate: number): {
    subtotal: number;
    taxAmount: number;
    total: number;
  };
}
