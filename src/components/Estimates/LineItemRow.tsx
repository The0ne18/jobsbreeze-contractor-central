
import { EstimateItem } from "@/models/Estimate";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";

interface LineItemRowProps {
  item: EstimateItem;
  onUpdate: (id: string, field: keyof EstimateItem, value: any) => void;
  onRemove: (id: string) => void;
}

export function LineItemRow({ item, onUpdate, onRemove }: LineItemRowProps) {
  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <div className="col-span-5">
        <Input 
          value={item.description} 
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          placeholder="Item description"
        />
      </div>
      <div className="col-span-2">
        <Select 
          value={item.category} 
          onValueChange={(value) => onUpdate(item.id, 'category', value as 'labor' | 'materials' | 'other')}
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
          onChange={(e) => onUpdate(item.id, 'quantity', Number(e.target.value))}
          min={1}
        />
      </div>
      <div className="col-span-2">
        <Input 
          type="number" 
          value={item.rate} 
          onChange={(e) => onUpdate(item.id, 'rate', Number(e.target.value))}
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
          onClick={() => onRemove(item.id)}
        >
          <MinusCircle className="h-4 w-4 text-red-500" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}
