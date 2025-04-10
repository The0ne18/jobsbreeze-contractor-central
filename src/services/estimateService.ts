
import { supabase } from "@/integrations/supabase/client";
import { Estimate, EstimateItem, NewEstimate } from "@/models/Estimate";
import { generateEstimateNumber } from "@/utils/estimateUtils";

// Helper function to convert database estimate to our model
const mapDbEstimateToModel = (dbEstimate: any, items: any[] = []): Estimate => {
  return {
    id: dbEstimate.id,
    clientId: dbEstimate.client_id,
    clientName: dbEstimate.client_name,
    status: dbEstimate.status,
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

// Helper function to convert database estimate item to our model
const mapDbEstimateItemToModel = (dbItem: any): EstimateItem => {
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

export const getEstimates = async (): Promise<Estimate[]> => {
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
    const itemsByEstimateId: Record<string, any[]> = {};
    if (allItems) {
      allItems.forEach(item => {
        if (!itemsByEstimateId[item.estimate_id]) {
          itemsByEstimateId[item.estimate_id] = [];
        }
        itemsByEstimateId[item.estimate_id].push(item);
      });
    }
    
    // Map DB estimates to model estimates with their items
    return data ? data.map(est => mapDbEstimateToModel(est, itemsByEstimateId[est.id] || [])) : [];
  } catch (error) {
    console.error('Failed to fetch estimates:', error);
    throw error;
  }
};

export const getEstimate = async (id: string): Promise<Estimate | undefined> => {
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
    
    return mapDbEstimateToModel(data, items || []);
  } catch (error) {
    console.error('Failed to fetch estimate:', error);
    throw error;
  }
};

export const createEstimate = async (estimate: NewEstimate): Promise<Estimate> => {
  try {
    // Start a Supabase transaction using a single batch request
    
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
    const estimateNumber = generateEstimateNumber(
      estimate.clientName, 
      existingEstimates ? existingEstimates.map(e => ({ id: e.id, clientName: e.client_name })) : []
    );
    
    // Get current user id
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || '';
    
    // 3. Prepare estimate data
    const estimateData = {
      id: estimateNumber,
      client_id: estimate.clientId,
      client_name: estimate.clientName,
      status: 'draft',
      date: estimate.date.toISOString().split('T')[0],
      expiration_date: estimate.expirationDate.toISOString().split('T')[0],
      subtotal: estimate.subtotal,
      tax_rate: estimate.taxRate,
      tax_amount: estimate.taxAmount,
      total: estimate.total,
      notes: estimate.notes,
      terms: estimate.terms,
      user_id: userId,
    };
    
    // 4. Insert the estimate
    const { data: newEstimate, error } = await supabase
      .from('estimates')
      .insert(estimateData)
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
      const itemsData = estimate.items.map(item => ({
        estimate_id: newEstimate.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        tax: item.tax,
        total: item.total,
        category: item.category,
      }));
      
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
    return mapDbEstimateToModel(newEstimate, estimate.items);
  } catch (error) {
    console.error('Failed to create estimate:', error);
    throw error;
  }
};

export const updateEstimate = async (id: string, updatedEstimate: Partial<Estimate>): Promise<Estimate | null> => {
  try {
    // Prepare estimate data
    const estimateData: any = {};
    
    // Only include fields that were provided
    if (updatedEstimate.clientId) estimateData.client_id = updatedEstimate.clientId;
    if (updatedEstimate.clientName) estimateData.client_name = updatedEstimate.clientName;
    if (updatedEstimate.status) estimateData.status = updatedEstimate.status;
    if (updatedEstimate.date) {
      // Convert Date to ISO string for database
      if (updatedEstimate.date instanceof Date) {
        estimateData.date = updatedEstimate.date.toISOString().split('T')[0];
      } else {
        estimateData.date = updatedEstimate.date;
      }
    }
    if (updatedEstimate.expirationDate) {
      // Convert Date to ISO string for database
      if (updatedEstimate.expirationDate instanceof Date) {
        estimateData.expiration_date = updatedEstimate.expirationDate.toISOString().split('T')[0];
      } else {
        estimateData.expiration_date = updatedEstimate.expirationDate;
      }
    }
    if (updatedEstimate.subtotal !== undefined) estimateData.subtotal = updatedEstimate.subtotal;
    if (updatedEstimate.taxRate !== undefined) estimateData.tax_rate = updatedEstimate.taxRate;
    if (updatedEstimate.taxAmount !== undefined) estimateData.tax_amount = updatedEstimate.taxAmount;
    if (updatedEstimate.total !== undefined) estimateData.total = updatedEstimate.total;
    if (updatedEstimate.notes !== undefined) estimateData.notes = updatedEstimate.notes;
    if (updatedEstimate.terms !== undefined) estimateData.terms = updatedEstimate.terms;
    
    // Update the estimate
    const { data, error } = await supabase
      .from('estimates')
      .update(estimateData)
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
        const itemsData = updatedEstimate.items.map(item => ({
          estimate_id: id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          tax: item.tax,
          total: item.total,
          category: item.category,
        }));
        
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
      return mapDbEstimateToModel(data, items || []);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to update estimate:', error);
    throw error;
  }
};

export const deleteEstimate = async (id: string): Promise<boolean> => {
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
