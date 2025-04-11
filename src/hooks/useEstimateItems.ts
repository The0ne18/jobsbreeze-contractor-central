
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { EstimateItem } from "@/models/Estimate";
import { calculateEstimateTotals } from "@/services/estimateService";
import { toast } from "sonner";

export function useEstimateItems(initialTaxRate: number = 0) {
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [taxRate, setTaxRate] = useState(initialTaxRate);
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
      const updatedItems = [...prevItems, newItem];
      console.log("useEstimateItems - items after adding blank:", updatedItems);
      return updatedItems;
    });
  }, []);

  // Add a pre-built item from the catalog
  const addItemFromCatalog = useCallback((newItem: EstimateItem) => {
    console.log("useEstimateItems - addItemFromCatalog called with:", newItem);
    
    // Validate the item has all required fields
    if (!newItem || !newItem.id || !newItem.description) {
      console.error("useEstimateItems - Invalid item format:", newItem);
      toast.error("Invalid item format");
      return;
    }
    
    // Ensure essential numeric values are valid
    if (typeof newItem.quantity !== 'number' || newItem.quantity <= 0) {
      console.warn("useEstimateItems - Fixing invalid quantity:", newItem.quantity);
      newItem.quantity = 1;
    }
    
    if (typeof newItem.rate !== 'number') {
      console.warn("useEstimateItems - Fixing invalid rate:", newItem.rate);
      newItem.rate = 0;
    }
    
    // Recalculate the total to ensure consistency
    const calculatedTotal = newItem.quantity * newItem.rate;
    if (newItem.total !== calculatedTotal) {
      console.warn(`useEstimateItems - Fixing item total: ${newItem.total} → ${calculatedTotal}`);
      newItem.total = calculatedTotal;
    }
    
    console.log("useEstimateItems - Validated catalog item:", newItem);
    
    // Use functional update to avoid stale state issues
    setItems(prevItems => {
      const updatedItems = [...prevItems, newItem];
      console.log("useEstimateItems - items after adding catalog item:", updatedItems);
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
  const updateTotals = useCallback((currentItems: EstimateItem[], currentTaxRate: number) => {
    console.log("useEstimateItems - updating totals with:", {
      itemsCount: currentItems.length,
      taxRate: currentTaxRate
    });
    
    const { subtotal, taxAmount, total } = calculateEstimateTotals(currentItems, currentTaxRate);
    console.log("useEstimateItems - calculated totals:", { subtotal, taxAmount, total });
    
    setTotals({ subtotal, taxAmount, total });
  }, []);

  // Update tax rate
  const updateTaxRate = useCallback((newTaxRate: number) => {
    console.log("useEstimateItems - updateTaxRate called with:", newTaxRate);
    setTaxRate(newTaxRate);
  }, []);

  // Effect to recalculate totals when items or tax rate change
  useEffect(() => {
    console.log("useEstimateItems - calculating totals due to items/taxRate change");
    updateTotals(items, taxRate);
  }, [items, taxRate, updateTotals]);

  // Effect to sync initial tax rate
  useEffect(() => {
    if (initialTaxRate !== taxRate) {
      console.log(`useEstimateItems - Syncing tax rate: ${taxRate} → ${initialTaxRate}`);
      setTaxRate(initialTaxRate);
    }
  }, [initialTaxRate]);

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
