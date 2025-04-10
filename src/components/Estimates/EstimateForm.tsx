
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EstimateItem, NewEstimate } from "@/models/Estimate";
import { Client } from "@/models/Client";
import { getClients } from "@/services/clientService";
import { calculateEstimateTotals } from "@/services/estimateService";

// Import refactored components
import { ClientSelection } from "./ClientSelection";
import { EstimateDetails } from "./EstimateDetails";
import { LineItems } from "./LineItems";
import { EstimateSummary } from "./EstimateSummary";
import { AdditionalInformation } from "./AdditionalInformation";

// Define the form schema with Zod
const formSchema = z.object({
  clientId: z.string({ required_error: "Please select a client" }),
  date: z.date({ required_error: "Please select a date" }),
  expirationDate: z.date({ required_error: "Please select an expiration date" }),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EstimateFormProps {
  onSubmit: (data: NewEstimate) => void;
  onCancel: () => void;
}

export default function EstimateForm({ onSubmit, onCancel }: EstimateFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0
  });

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      expirationDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      taxRate: 0,
      notes: "",
      terms: "Net 30",
    },
  });

  // Fetch clients when component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const fetchedClients = await getClients();
        setClients(fetchedClients);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

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
    updateTotals(updatedItems, form.getValues().taxRate);
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
    updateTotals(updatedItems, form.getValues().taxRate);
  };

  // Update totals when items or tax rate changes
  const updateTotals = (currentItems: EstimateItem[], taxRate: number) => {
    const { subtotal, taxAmount, total } = calculateEstimateTotals(currentItems, taxRate);
    setTotals({ subtotal, taxAmount, total });
  };

  // Watch tax rate changes to update totals
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'taxRate') {
        updateTotals(items, value.taxRate as number);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, items]);

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    const { clientId, date, expirationDate, taxRate, notes, terms } = values;
    const clientName = clients.find(c => c.id === clientId)?.name || '';
    
    const estimateData: NewEstimate = {
      clientId,
      clientName,
      date,
      expirationDate,
      items,
      subtotal: totals.subtotal,
      taxRate,
      taxAmount: totals.taxAmount,
      total: totals.total,
      notes: notes || "",
      terms: terms || "",
    };
    
    onSubmit(estimateData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">New Estimate</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Client Selection */}
          <ClientSelection form={form} clients={clients} loading={loading} />

          {/* Estimate Details */}
          <EstimateDetails form={form} />

          {/* Line Items */}
          <LineItems 
            items={items} 
            onAddItem={addItem} 
            onUpdateItem={updateItem} 
            onRemoveItem={removeItem} 
          />

          {/* Summary and Totals */}
          <EstimateSummary 
            form={form} 
            subtotal={totals.subtotal} 
            taxAmount={totals.taxAmount} 
            total={totals.total} 
          />

          {/* Notes and Terms */}
          <AdditionalInformation form={form} />

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Estimate
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
