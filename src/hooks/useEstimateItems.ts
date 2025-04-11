
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { EstimateItem } from "@/models/Estimate";
import { calculateEstimateTotals } from "@/services/estimateService";

export function useEstimateItems(initialTaxRate: number = 0) {
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0
  });

  // Add a new blank item to the estimate
  const addItem = useCallback(() => {
    const newItem: EstimateItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      rate: 0,
      tax: false,
      total: 0,
      category: "labor",
    };
    console.log("useEstimateItems - adding new blank item:", newItem);
    
    setItems(prevItems => {
      console.log("useEstimateItems - previous items:", prevItems);
      const updatedItems = [...prevItems, newItem];
      console.log("useEstimateItems - updated items after adding blank:", updatedItems);
      return updatedItems;
    });
  }, []);

  // Add an item from the catalog
  const addItemFromCatalog = useCallback((item: EstimateItem) => {
    console.log("useEstimateItems - addItemFromCatalog called with:", item);
    
    // Validate incoming item
    if (!item || typeof item !== 'object') {
      console.error("useEstimateItems - Invalid item received:", item);
      return;
    }
    
    // Ensure the item has an ID (if not, generate one)
    if (!item.id) {
      item.id = uuidv4();
    }
    
    // Create a validated copy to avoid mutation issues
    const validatedItem: EstimateItem = {
      id: item.id,
      description: item.description || "",
      quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
      rate: typeof item.rate === 'number' ? item.rate : 0,
      tax: !!item.tax,
      total: typeof item.quantity === 'number' && typeof item.rate === 'number' 
             ? item.quantity * item.rate 
             : 0,
      category: item.category || "labor",
    };
    
    console.log("useEstimateItems - validated catalog item:", validatedItem);
    
    // Use functional update to work with latest state
    setItems(prevItems => {
      console.log("useEstimateItems - previous items:", prevItems);
      const updatedItems = [...prevItems, validatedItem];
      console.log("useEstimateItems - updated items after adding catalog item:", updatedItems);
      return updatedItems;
    });
  }, []);

  // Remove an item from the estimate
  const removeItem = useCallback((id: string) => {
    console.log("useEstimateItems - removing item:", id);
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      console.log("useEstimateItems - items after removal:", updatedItems);
      return updatedItems;
    });
  }, []);

  // Update an item in the estimate
  const updateItem = useCallback((id: string, field: keyof EstimateItem, value: any) => {
    console.log(`useEstimateItems - updating item ${id}, field ${field}:`, value);
    
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Calculate total if quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            updatedItem.total = updatedItem.quantity * updatedItem.rate;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      console.log("useEstimateItems - items after update:", updatedItems);
      return updatedItems;
    });
  }, []);

  // Update totals based on current items and tax rate
  const updateTotals = useCallback((currentItems: EstimateItem[], taxRate: number) => {
    console.log("useEstimateItems - updating totals with taxRate:", taxRate);
    console.log("useEstimateItems - items for total calculation:", currentItems);
    
    const { subtotal, taxAmount, total } = calculateEstimateTotals(currentItems, taxRate);
    console.log("useEstimateItems - calculated totals:", { subtotal, taxAmount, total });
    
    setTotals({ subtotal, taxAmount, total });
  }, []);

  // Update tax rate
  const updateTaxRate = useCallback((taxRate: number) => {
    console.log("useEstimateItems - updateTaxRate called with:", taxRate);
    updateTotals(items, taxRate);
  }, [items, updateTotals]);

  // Effect to recalculate totals when items change
  useEffect(() => {
    console.log("useEstimateItems - items changed, recalculating totals:", items);
    updateTotals(items, initialTaxRate);
  }, [items, initialTaxRate, updateTotals]);

  return {
    items,
    totals,
    addItem,
    addItemFromCatalog,
    removeItem,
    updateItem,
    updateTaxRate,
    setItems
  };
}
