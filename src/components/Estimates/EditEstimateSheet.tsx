
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import EstimateForm from "@/components/Estimates/EstimateForm";
import { Estimate, NewEstimate } from "@/models/Estimate";
import { getEstimate, updateEstimate } from "@/services/estimateService";

interface EditEstimateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimateId?: string;
  onEstimateUpdated?: () => void;
}

export function EditEstimateSheet({ 
  open, 
  onOpenChange,
  estimateId,
  onEstimateUpdated
}: EditEstimateSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEstimate = async () => {
      if (open && estimateId) {
        setIsLoading(true);
        try {
          const data = await getEstimate(estimateId);
          if (data) {
            setCurrentEstimate(data);
          }
        } catch (error) {
          console.error("Failed to fetch estimate:", error);
          toast.error("Failed to load estimate");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEstimate();
  }, [open, estimateId]);

  const handleSubmit = async (data: NewEstimate) => {
    if (!estimateId) return;
    
    setIsSubmitting(true);
    try {
      await updateEstimate(estimateId, {
        ...data,
        status: currentEstimate?.status || 'draft'
      });
      toast.success("Estimate updated successfully");
      onOpenChange(false);
      if (onEstimateUpdated) {
        onEstimateUpdated();
      }
    } catch (error) {
      console.error("Failed to update estimate:", error);
      toast.error("Failed to update estimate");
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading estimate...</p>
          </div>
        ) : currentEstimate ? (
          <EstimateForm 
            estimate={currentEstimate}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Estimate not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
