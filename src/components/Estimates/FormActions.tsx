
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function FormActions({ onCancel, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        <Save className="mr-2 h-4 w-4" />
        Save Estimate
      </Button>
    </div>
  );
}
