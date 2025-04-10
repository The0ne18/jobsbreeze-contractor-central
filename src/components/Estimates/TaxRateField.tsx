
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface TaxRateFieldProps {
  form: UseFormReturn<any>;
  value: number;
  onChange: (value: number) => void;
}

export function TaxRateField({ form, value, onChange }: TaxRateFieldProps) {
  return (
    <FormField
      control={form.control}
      name="taxRate"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                field.onChange(newValue);
                onChange(newValue);
              }}
              min={0}
              max={100}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
