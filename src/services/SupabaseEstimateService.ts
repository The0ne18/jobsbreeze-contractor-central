import { supabase } from "@/integrations/supabase/client";
import { Estimate, EstimateItem, NewEstimate } from "@/models/Estimate";
import { DbEstimate, DbEstimateItem } from "@/models/database/DbEstimate";
import { 
  mapDbEstimateToModel, 
  mapNewEstimateToDb, 
  mapEstimateItemsToDb, 
  mapEstimateUpdateToDb 
} from "@/mappers/EstimateMapper";
import { IEstimateService } from "./interfaces/IEstimateService";
import { generateEstimateNumber } from "@/utils/estimateUtils";

export interface GetEstimatesOptions {
  page?: number;
  limit?: number;
  status?: string;
  searchQuery?: string;
}

/**
 * Implementation of IEstimateService using Supabase
 */
export class SupabaseEstimateService implements IEstimateService {
  private cache: Map<string, { data: Estimate, timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  async getEstimates(options: GetEstimatesOptions = {}): Promise<{ data: Estimate[], total: number }> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        searchQuery 
      } = options;
      
      const offset = (page - 1) * limit;
      
      // Start building the query
      let query = supabase
        .from('estimates')
        .select('*', { count: 'exact' });
      
      // Apply filters if provided
      if (status) {
        query = query.eq('status', status);
      }
      
      if (searchQuery) {
        query = query.or(`client_name.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`);
      }
      
      // Apply pagination
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching estimates:', error);
        throw error;
      }
      
      if (!data || !count) {
        return { data: [], total: 0 };
      }
      
      // Get estimate IDs to fetch items
      const estimateIds = data.map(est => est.id);
      
      // Get items only for these estimates
      const { data: allItems, error: itemsError } = await supabase
        .from('estimate_items')
        .select('*')
        .in('estimate_id', estimateIds);
      
      if (itemsError) {
        console.error('Error fetching estimate items:', itemsError);
        throw itemsError;
      }
      
      // Group items by estimate_id
      const itemsByEstimateId: Record<string, DbEstimateItem[]> = {};
      if (allItems) {
        allItems.forEach(item => {
          if (!itemsByEstimateId[item.estimate_id]) {
            itemsByEstimateId[item.estimate_id] = [];
          }
          itemsByEstimateId[item.estimate_id].push(item as DbEstimateItem);
        });
      }
      
      // Map DB estimates to model estimates with their items
      const estimates = data.map(est => 
        mapDbEstimateToModel(est as DbEstimate, itemsByEstimateId[est.id] || [])
      );
      
      return { 
        data: estimates, 
        total: count 
      };
    } catch (error) {
      console.error('Failed to fetch estimates:', error);
      throw error;
    }
  }

  async getEstimate(id: string): Promise<Estimate | undefined> {
    try {
      // Check cache first
      const cachedEstimate = this.cache.get(id);
      if (cachedEstimate && (Date.now() - cachedEstimate.timestamp < this.CACHE_DURATION)) {
        console.log('Using cached estimate data for ID:', id);
        return cachedEstimate.data;
      }
      
      // If not in cache, fetch from database
      const [estimateResult, itemsResult] = await Promise.all([
        // Get the estimate
        supabase
          .from('estimates')
          .select('*')
          .eq('id', id)
          .single(),
          
        // Get estimate items in parallel
        supabase
          .from('estimate_items')
          .select('*')
          .eq('estimate_id', id)
      ]);
      
      const { data: estimate, error } = estimateResult;
      const { data: items, error: itemsError } = itemsResult;
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching estimate:', error);
          throw error;
        }
        return undefined;
      }
      
      if (itemsError) {
        console.error('Error fetching estimate items:', itemsError);
        throw itemsError;
      }
      
      const mappedEstimate = mapDbEstimateToModel(
        estimate as DbEstimate, 
        items as DbEstimateItem[] || []
      );
      
      // Cache the result
      this.cache.set(id, {
        data: mappedEstimate,
        timestamp: Date.now()
      });
      
      return mappedEstimate;
    } catch (error) {
      console.error('Failed to fetch estimate:', error);
      throw error;
    }
  }

  async createEstimate(estimate: NewEstimate): Promise<Estimate> {
    try {
      // 1. Get the current estimates for generating a number
      const { data: existingEstimates, error: fetchError } = await supabase
        .from('estimates')
        .select('id, client_name')
        .limit(10);
      
      if (fetchError) {
        console.error('Error fetching existing estimates:', fetchError);
        throw fetchError;
      }
      
      // 2. Generate estimate number
      // Create properly formatted Estimate objects for number generation
      const estimatesForNumberGen = existingEstimates ? existingEstimates.map(e => ({
        id: e.id,
        clientName: e.client_name,
        clientId: '',
        status: 'draft' as const,
        date: new Date(),
        expirationDate: new Date(),
        items: [],
        subtotal: 0,
        taxRate: 0,
        taxAmount: 0,
        total: 0,
        notes: '',
        terms: '',
        createdAt: new Date()
      })) : [];
      
      const estimateNumber = generateEstimateNumber(
        estimate.clientName, 
        estimatesForNumberGen
      );
      
      // Get current user id
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || '';
      
      // 3. Prepare estimate data
      const dbEstimate = mapNewEstimateToDb(estimate, estimateNumber, userId);
      
      // 4. Insert the estimate
      const { data: newEstimate, error } = await supabase
        .from('estimates')
        .insert(dbEstimate)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating estimate:', error);
        throw error;
      }
      
      if (!newEstimate) {
        throw new Error('Failed to create estimate: No data returned');
      }
      
      if (estimate.items.length > 0) {
        // 5. Prepare item data with the new estimate ID
        const itemsData = mapEstimateItemsToDb(estimate.items, newEstimate.id);
        
        // 6. Insert the items
        const { error: itemsError } = await supabase
          .from('estimate_items')
          .insert(itemsData);
        
        if (itemsError) {
          console.error('Error creating estimate items:', itemsError);
          throw itemsError;
        }
      }
      
      // 7. Return the created estimate with items
      return mapDbEstimateToModel(newEstimate as DbEstimate, 
        estimate.items.map((item, index) => ({
          ...item,
          id: `temp-${index}`, // Temporary IDs since we don't have the real ones yet
          estimate_id: newEstimate.id,
          created_at: new Date().toISOString()
        } as DbEstimateItem))
      );
    } catch (error) {
      console.error('Failed to create estimate:', error);
      throw error;
    }
  }

  async updateEstimate(id: string, updatedEstimate: Partial<Estimate>): Promise<Estimate | null> {
    try {
      // Prepare estimate data
      const dbEstimate = mapEstimateUpdateToDb(updatedEstimate);
      
      // Update the estimate
      const { data, error } = await supabase
        .from('estimates')
        .update(dbEstimate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating estimate:', error);
        throw error;
      }
      
      // Handle estimate items if provided
      if (updatedEstimate.items) {
        // Delete existing items
        const { error: deleteError } = await supabase
          .from('estimate_items')
          .delete()
          .eq('estimate_id', id);
        
        if (deleteError) {
          console.error('Error deleting estimate items:', deleteError);
          throw deleteError;
        }
        
        if (updatedEstimate.items.length > 0) {
          // Insert new items
          const itemsData = mapEstimateItemsToDb(updatedEstimate.items, id);
          
          const { error: insertError } = await supabase
            .from('estimate_items')
            .insert(itemsData);
          
          if (insertError) {
            console.error('Error inserting estimate items:', insertError);
            throw insertError;
          }
        }
      }
      
      // Get all items for the updated estimate
      const { data: items, error: itemsError } = await supabase
        .from('estimate_items')
        .select('*')
        .eq('estimate_id', id);
      
      if (itemsError) {
        console.error('Error fetching updated estimate items:', itemsError);
        throw itemsError;
      }
      
      // Invalidate cache for this estimate
      this.cache.delete(id);
      
      if (data) {
        return mapDbEstimateToModel(data as DbEstimate, items as DbEstimateItem[] || []);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to update estimate:', error);
      throw error;
    }
  }

  async deleteEstimate(id: string): Promise<boolean> {
    try {
      // Delete estimate items first (the cascade should handle this, but let's be explicit)
      const { error: itemsError } = await supabase
        .from('estimate_items')
        .delete()
        .eq('estimate_id', id);
      
      if (itemsError) {
        console.error('Error deleting estimate items:', itemsError);
        throw itemsError;
      }
      
      // Delete the estimate
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting estimate:', error);
        throw error;
      }
      
      // Remove from cache if exists
      this.cache.delete(id);
      
      return true;
    } catch (error) {
      console.error('Failed to delete estimate:', error);
      throw error;
    }
  }

  calculateEstimateTotals(items: EstimateItem[], taxRate: number) {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    
    return {
      subtotal,
      taxAmount,
      total
    };
  }
}

// Create a singleton instance of the service
export const estimateService = new SupabaseEstimateService();
