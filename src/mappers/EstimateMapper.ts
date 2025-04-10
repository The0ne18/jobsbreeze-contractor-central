
import { Estimate, EstimateItem, NewEstimate } from "@/models/Estimate";
import { DbEstimate, DbEstimateItem, DbNewEstimate, DbNewEstimateItem } from "@/models/database/DbEstimate";

/**
 * Maps a database estimate entity to a frontend estimate model
 */
export const mapDbEstimateToModel = (dbEstimate: DbEstimate, items: DbEstimateItem[] = []): Estimate => {
  return {
    id: dbEstimate.id,
    clientId: dbEstimate.client_id,
    clientName: dbEstimate.client_name,
    status: dbEstimate.status as 'draft' | 'pending' | 'approved' | 'declined',
    date: dbEstimate.date,
    expirationDate: dbEstimate.expiration_date,
    items: items.map(item => mapDbEstimateItemToModel(item)),
    subtotal: dbEstimate.subtotal,
    taxRate: dbEstimate.tax_rate,
    taxAmount: dbEstimate.tax_amount,
    total: dbEstimate.total,
    notes: dbEstimate.notes || '',
    terms: dbEstimate.terms || '',
    createdAt: dbEstimate.created_at,
    user_id: dbEstimate.user_id,
    
    // Include the original database fields for direct access if needed
    client_id: dbEstimate.client_id,
    client_name: dbEstimate.client_name,
    expiration_date: dbEstimate.expiration_date,
    tax_rate: dbEstimate.tax_rate,
    tax_amount: dbEstimate.tax_amount,
    created_at: dbEstimate.created_at,
    updated_at: dbEstimate.updated_at
  };
};

/**
 * Maps a database estimate item entity to a frontend estimate item model
 */
export const mapDbEstimateItemToModel = (dbItem: DbEstimateItem): EstimateItem => {
  return {
    id: dbItem.id,
    description: dbItem.description,
    quantity: dbItem.quantity,
    rate: dbItem.rate,
    tax: dbItem.tax,
    total: dbItem.total,
    category: dbItem.category as 'labor' | 'materials' | 'other',
    estimate_id: dbItem.estimate_id,
    created_at: dbItem.created_at
  };
};

/**
 * Maps a frontend new estimate to a database new estimate entity
 */
export const mapNewEstimateToDb = (estimate: NewEstimate, estimateId: string, userId: string): DbNewEstimate => {
  return {
    id: estimateId,
    client_id: estimate.clientId,
    client_name: estimate.clientName,
    status: 'draft',
    date: estimate.date instanceof Date ? estimate.date.toISOString().split('T')[0] : estimate.date.toString(),
    expiration_date: estimate.expirationDate instanceof Date ? estimate.expirationDate.toISOString().split('T')[0] : estimate.expirationDate.toString(),
    subtotal: estimate.subtotal,
    tax_rate: estimate.taxRate,
    tax_amount: estimate.taxAmount,
    total: estimate.total,
    notes: estimate.notes || null,
    terms: estimate.terms || null,
    user_id: userId,
  };
};

/**
 * Maps frontend estimate items to database estimate items
 */
export const mapEstimateItemsToDb = (items: EstimateItem[], estimateId: string): DbNewEstimateItem[] => {
  return items.map(item => ({
    estimate_id: estimateId,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    tax: item.tax,
    total: item.total,
    category: item.category,
  }));
};

/**
 * Maps a frontend estimate model to a database update estimate entity
 */
export const mapEstimateUpdateToDb = (estimate: Partial<Estimate>): Partial<DbEstimate> => {
  const dbEstimate: Partial<DbEstimate> = {};
  
  // Only include fields that were provided
  if (estimate.clientId) dbEstimate.client_id = estimate.clientId;
  if (estimate.clientName) dbEstimate.client_name = estimate.clientName;
  if (estimate.status) dbEstimate.status = estimate.status;
  if (estimate.date) {
    // Convert Date to ISO string for database
    if (estimate.date instanceof Date) {
      dbEstimate.date = estimate.date.toISOString().split('T')[0];
    } else {
      dbEstimate.date = estimate.date.toString();
    }
  }
  if (estimate.expirationDate) {
    // Convert Date to ISO string for database
    if (estimate.expirationDate instanceof Date) {
      dbEstimate.expiration_date = estimate.expirationDate.toISOString().split('T')[0];
    } else {
      dbEstimate.expiration_date = estimate.expirationDate.toString();
    }
  }
  if (estimate.subtotal !== undefined) dbEstimate.subtotal = estimate.subtotal;
  if (estimate.taxRate !== undefined) dbEstimate.tax_rate = estimate.taxRate;
  if (estimate.taxAmount !== undefined) dbEstimate.tax_amount = estimate.taxAmount;
  if (estimate.total !== undefined) dbEstimate.total = estimate.total;
  if (estimate.notes !== undefined) dbEstimate.notes = estimate.notes || null;
  if (estimate.terms !== undefined) dbEstimate.terms = estimate.terms || null;
  
  return dbEstimate;
};
