
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface EstimateSummaryProps {
  form: UseFormReturn<any>;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export function EstimateSummary({ form, subtotal, taxAmount, total }: EstimateSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Summary</h3>
      <div className="bg-muted/40 p-4 rounded-md">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
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
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          
          <div className="border-t pt-2 mt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
