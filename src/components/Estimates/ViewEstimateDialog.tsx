import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Estimate } from "@/models/Estimate";
import { getEstimate } from "@/services/estimateService";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, PenLine } from "lucide-react";

interface ViewEstimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimateId?: string;
  onEdit?: (estimate: Estimate) => void;
}

export function ViewEstimateDialog({ 
  open, 
  onOpenChange,
  estimateId,
  onEdit
}: ViewEstimateDialogProps) {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEstimate = async () => {
      if (open && estimateId) {
        setIsLoading(true);
        try {
          const data = await getEstimate(estimateId);
          if (data) {
            setEstimate(data);
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

  const handleEdit = () => {
    if (estimate && onEdit) {
      onOpenChange(false);
      onEdit(estimate);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading estimate...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!estimate) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <div className="flex justify-center p-8">
            <p>Estimate not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Estimate #{estimate.id}</DialogTitle>
            <Badge variant="outline" className="bg-gray-100 text-gray-600 font-medium uppercase text-xs">
              {estimate.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Client Info */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Client</h3>
            <p className="text-sm">{estimate.clientName}</p>
          </div>
          
          {/* Dates */}
          <div className="flex justify-between border-b pb-4">
            <div>
              <h3 className="font-medium mb-2">Date</h3>
              <p className="text-sm">{format(new Date(estimate.date), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Expiration Date</h3>
              <p className="text-sm">{format(new Date(estimate.expirationDate), "MMMM d, yyyy")}</p>
            </div>
          </div>
          
          {/* Line Items */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Line Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimate.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.description}
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
                  <TableCell className="text-right">${estimate.subtotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right">Tax ({estimate.taxRate}%)</TableCell>
                  <TableCell className="text-right">${estimate.taxAmount.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                  <TableCell className="text-right font-medium">${estimate.total.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          
          {/* Notes & Terms */}
          {(estimate.notes || estimate.terms) && (
            <div className="space-y-4">
              {estimate.notes && (
                <div>
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm whitespace-pre-wrap">{estimate.notes}</p>
                </div>
              )}
              {estimate.terms && (
                <div>
                  <h3 className="font-medium mb-2">Terms</h3>
                  <p className="text-sm whitespace-pre-wrap">{estimate.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleEdit}>
            <PenLine className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
