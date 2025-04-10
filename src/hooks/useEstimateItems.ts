
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

  // Add a new item to the estimate
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
    setItems(prevItems => [...prevItems, newItem]);
  }, []);

  // Add an item from the catalog
  const addItemFromCatalog = useCallback((item: EstimateItem) => {
    console.log("useEstimateItems - adding from catalog:", item);
    
    // Ensure we're adding a valid item
    if (!item || !item.id) {
      console.error("Invalid item received in addItemFromCatalog:", item);
      return;
    }
    
    // Ensure total is calculated correctly
    const validatedItem = {
      ...item,
      total: (item.quantity || 1) * (item.rate || 0)
    };
    
    // Use functional update pattern to ensure we're working with latest state
    setItems(prevItems => {
      console.log("useEstimateItems - current items:", prevItems);
      const updatedItems = [...prevItems, validatedItem];
      console.log("useEstimateItems - updated items:", updatedItems);
      return updatedItems;
    });
  }, []);

  // Remove an item from the estimate
  const removeItem = useCallback((id: string) => {
    console.log("useEstimateItems - removing item:", id);
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updateTotals(updatedItems, initialTaxRate);
  }, [items, initialTaxRate]);

  // Update an item in the estimate
  const updateItem = useCallback((id: string, field: keyof EstimateItem, value: any) => {
    console.log(`useEstimateItems - updating item ${id}, field ${field}:`, value);
    const updatedItems = items.map(item => {
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
    
    setItems(updatedItems);
    updateTotals(updatedItems, initialTaxRate);
  }, [items, initialTaxRate]);

  // Update totals when items or tax rate changes
  const updateTotals = useCallback((currentItems: EstimateItem[], taxRate: number) => {
    const { subtotal, taxAmount, total } = calculateEstimateTotals(currentItems, taxRate);
    setTotals({ subtotal, taxAmount, total });
  }, []);

  // Update totals when tax rate changes
  const updateTaxRate = useCallback((taxRate: number) => {
    updateTotals(items, taxRate);
  }, [items, updateTotals]);

  // Effect to recalculate totals when items change
  useEffect(() => {
    console.log("useEstimateItems - items changed, recalculating totals", items);
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
