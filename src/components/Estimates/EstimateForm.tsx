
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, MinusCircle, PlusCircle, Save, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { EstimateItem, NewEstimate } from "@/models/Estimate";
import { Client } from "@/models/Client";
import { getClients } from "@/services/clientService";
import { calculateEstimateTotals } from "@/services/estimateService";
import { cn } from "@/lib/utils";

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
          <div className="space-y-4">
            <h3 className="font-medium">Client Information</h3>
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Estimate Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Estimate Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Estimate Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Line Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No items added. Click "Add Item" to add your first item.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1"></div>
                </div>
                
                {/* Item Rows */}
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-5">
                      <Input 
                        value={item.description} 
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Select 
                        value={item.category} 
                        onValueChange={(value) => updateItem(item.id, 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="materials">Materials</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        value={item.rate} 
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div className="col-span-1 pt-2">
                      ${item.total.toFixed(2)}
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <MinusCircle className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary and Totals */}
          <div className="space-y-4">
            <h3 className="font-medium">Summary</h3>
            <div className="bg-muted/40 p-4 rounded-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>Tax</span>
                    <div className="w-20">
                      <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={0}
                                max={100}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <span>%</span>
                  </div>
                  <span>${totals.taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="space-y-4">
            <h3 className="font-medium">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes for the client"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Terms and conditions for the estimate"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
