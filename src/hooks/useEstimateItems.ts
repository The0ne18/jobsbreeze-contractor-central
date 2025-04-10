
import { useState, useEffect } from "react";
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
  const addItem = () => {
    const newItem: EstimateItem = {
      id: uuidv4(),
      description: "",
      quantity: 1,
      rate: 0,
      tax: false,
      total: 0,
      category: "labor",
    };
    setItems([...items, newItem]);
  };

  // Remove an item from the estimate
  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updateTotals(updatedItems, initialTaxRate);
  };

  // Update an item in the estimate
  const updateItem = (id: string, field: keyof EstimateItem, value: any) => {
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
  };

  // Update totals when items or tax rate changes
  const updateTotals = (currentItems: EstimateItem[], taxRate: number) => {
    const { subtotal, taxAmount, total } = calculateEstimateTotals(currentItems, taxRate);
    setTotals({ subtotal, taxAmount, total });
  };

  // Update totals when tax rate changes
  const updateTaxRate = (taxRate: number) => {
    updateTotals(items, taxRate);
  };

  return {
    items,
    totals,
    addItem,
    removeItem,
    updateItem,
    updateTaxRate
  };
}
