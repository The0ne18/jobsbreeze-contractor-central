import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { NewEstimate } from "@/models/Estimate";
import { Client } from "@/models/Client";
import { getClients } from "@/services/clientService";

// Import refactored components
import { ClientSelection } from "./ClientSelection";
import { EstimateDetails } from "./EstimateDetails";
import { LineItems } from "./LineItems";
import { EstimateSummary } from "./EstimateSummary";
import { AdditionalInformation } from "./AdditionalInformation";
import { FormActions } from "./FormActions";
import { useEstimateItems } from "@/hooks/useEstimateItems";
import { TaxRateField } from "./TaxRateField";

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

  // Use our custom hook for items and totals
  const { 
    items, 
    totals, 
    addItem, 
    removeItem, 
    updateItem, 
    updateTaxRate 
  } = useEstimateItems(form.getValues().taxRate);

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
            taxRateField={
              <TaxRateField 
                form={form} 
                value={form.getValues().taxRate} 
                onChange={updateTaxRate} 
              />
            }
          />

          {/* Notes and Terms */}
          <AdditionalInformation form={form} />

          {/* Form Actions */}
          <FormActions onCancel={onCancel} />
        </form>
      </Form>
    </div>
  );
}
