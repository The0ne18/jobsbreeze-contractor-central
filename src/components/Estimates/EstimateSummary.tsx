
import { UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";

interface EstimateSummaryProps {
  form: UseFormReturn<any>;
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRateField?: ReactNode;
}

export function EstimateSummary({ form, subtotal, taxAmount, total, taxRateField }: EstimateSummaryProps) {
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
                {taxRateField}
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
