
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

/**
 * Implementation of IEstimateService using Supabase
 */
export class SupabaseEstimateService implements IEstimateService {
  async getEstimates(): Promise<Estimate[]> {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching estimates:', error);
        throw error;
      }
      
      // Get all estimate items
      const { data: allItems, error: itemsError } = await supabase
        .from('estimate_items')
        .select('*');
      
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
      return data ? data.map(est => 
        mapDbEstimateToModel(est as DbEstimate, itemsByEstimateId[est.id] || [])
      ) : [];
    } catch (error) {
      console.error('Failed to fetch estimates:', error);
      throw error;
    }
  }

  async getEstimate(id: string): Promise<Estimate | undefined> {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching estimate:', error);
          throw error;
        }
        return undefined;
      }
      
      // Get estimate items
      const { data: items, error: itemsError } = await supabase
        .from('estimate_items')
        .select('*')
        .eq('estimate_id', id);
      
      if (itemsError) {
        console.error('Error fetching estimate items:', itemsError);
        throw itemsError;
      }
      
      return mapDbEstimateToModel(data as DbEstimate, items as DbEstimateItem[] || []);
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
