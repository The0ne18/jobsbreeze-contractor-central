import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Estimate, NewEstimate, EstimateItem } from "@/models/Estimate";
import { Client } from "@/models/Client";
import { getClients } from "@/services/clientService";
import { toast } from "sonner";

import { ClientSelection } from "./ClientSelection";
import { EstimateDetails } from "./EstimateDetails";
import { LineItems } from "./LineItems";
import { EstimateSummary } from "./EstimateSummary";
import { AdditionalInformation } from "./AdditionalInformation";
import { FormActions } from "./FormActions";
import { useEstimateItems } from "@/hooks/useEstimateItems";
import { TaxRateField } from "./TaxRateField";

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
  estimate?: Estimate;
  onSubmit: (data: NewEstimate) => void;
  onCancel: () => void;
}

export default function EstimateForm({ estimate, onSubmit, onCancel }: EstimateFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  const defaultValues: Partial<FormValues> = {
    date: estimate ? new Date(estimate.date) : new Date(),
    expirationDate: estimate 
      ? new Date(estimate.expirationDate) 
      : new Date(new Date().setDate(new Date().getDate() + 30)),
    taxRate: estimate ? estimate.taxRate : 0,
    notes: estimate ? estimate.notes : "",
    terms: estimate ? estimate.terms : "Net 30",
    clientId: estimate ? estimate.clientId : "",
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { 
    items, 
    totals, 
    addItem, 
    removeItem, 
    updateItem, 
    updateTaxRate,
    setItems,
    addItemFromCatalog
  } = useEstimateItems(form.getValues().taxRate);

  // Detailed lifecycle logging for debugging
  useEffect(() => {
    console.log("EstimateForm - Component mounted");
    return () => console.log("EstimateForm - Component unmounted");
  }, []);

  // Add debug logging for items
  useEffect(() => {
    console.log("EstimateForm - Items updated:", items);
  }, [items]);

  // Debug logging for form values
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("EstimateForm - Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Debug logging for items state
  useEffect(() => {
    console.log("EstimateForm - items state changed:", items);
  }, [items]);

  // Form submission handler
  const handleSubmit = (values: FormValues) => {
    console.log("EstimateForm - Form submitted with values:", values);
    console.log("EstimateForm - Current items:", items);
    
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
    
    console.log("EstimateForm - Submitting estimate data:", estimateData);
    onSubmit(estimateData);
  };

  // Handle adding item from catalog with improved error handling
  const handleAddItemFromCatalog = (item: EstimateItem) => {
    console.log("EstimateForm - handleAddItemFromCatalog called with:", item);
    
    try {
      if (!item || !item.id) {
        throw new Error("Invalid item data");
      }
      
      addItemFromCatalog(item);
      toast.success("Item added to estimate");
    } catch (error) {
      console.error("Failed to add item from catalog:", error);
      toast.error("Failed to add item from catalog");
    }
  };

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log("EstimateForm - Fetching clients");
        const fetchedClients = await getClients();
        console.log("EstimateForm - Fetched clients:", fetchedClients.length);
        setClients(fetchedClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Initialize form with estimate data if editing
  useEffect(() => {
    if (estimate) {
      console.log("EstimateForm - Initializing with estimate:", estimate.id);
      
      form.reset({
        clientId: estimate.clientId,
        date: new Date(estimate.date),
        expirationDate: new Date(estimate.expirationDate),
        taxRate: estimate.taxRate,
        notes: estimate.notes,
        terms: estimate.terms,
      });
      
      setItems(estimate.items);
      updateTaxRate(estimate.taxRate);
      
      console.log("EstimateForm - Form initialized with estimate data");
    }
  }, [estimate, form, setItems, updateTaxRate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{estimate ? 'Edit Estimate' : 'New Estimate'}</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ClientSelection form={form} clients={clients} loading={loading} />
          <EstimateDetails form={form} />
          <LineItems 
            items={items} 
            onAddItem={addItem} 
            onUpdateItem={updateItem} 
            onRemoveItem={removeItem}
            onAddItemFromCatalog={handleAddItemFromCatalog}
          />
          <EstimateSummary 
            form={form} 
            subtotal={totals.subtotal} 
            taxAmount={totals.taxAmount} 
            total={totals.total} 
            taxRateField={
              <TaxRateField 
                form={form} 
                value={form.getValues().taxRate} 
                onChange={updateTaxRate} 
              />
            }
          />
          <AdditionalInformation form={form} />
          <FormActions onCancel={onCancel} />
        </form>
      </Form>
    </div>
  );
}
