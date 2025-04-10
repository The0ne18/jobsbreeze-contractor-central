
import { useState } from "react";
import { toast } from "sonner";
import { 
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import EstimateForm from "@/components/Estimates/EstimateForm";
import { NewEstimate } from "@/models/Estimate";
import { createEstimate } from "@/services/estimateService";

interface NewEstimateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEstimateCreated?: () => void;
}

export default function NewEstimateSheet({ 
  open, 
  onOpenChange,
  onEstimateCreated
}: NewEstimateSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NewEstimate) => {
    setIsSubmitting(true);
    try {
      await createEstimate(data);
      toast.success("Estimate created successfully");
      onOpenChange(false);
      if (onEstimateCreated) {
        onEstimateCreated();
      }
    } catch (error) {
      console.error("Failed to create estimate:", error);
      toast.error("Failed to create estimate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
        <EstimateForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </SheetContent>
    </Sheet>
  );
}
