
import React from "react";
import NewEstimateSheet from "@/components/Estimates/NewEstimateSheet";
import { ViewEstimateDialog } from "@/components/Estimates/ViewEstimateDialog";
import { EditEstimateSheet } from "@/components/Estimates/EditEstimateSheet";

interface EstimateDialogsProps {
  newEstimateOpen: boolean;
  setNewEstimateOpen: (open: boolean) => void;
  viewDialogOpen: boolean;
  setViewDialogOpen: (open: boolean) => void;
  editSheetOpen: boolean;
  setEditSheetOpen: (open: boolean) => void;
  selectedEstimateId?: string;
  onEstimateCreatedOrUpdated: () => void;
  onEditEstimate: (estimate: any) => void;
}

export function EstimateDialogs({
  newEstimateOpen,
  setNewEstimateOpen,
  viewDialogOpen,
  setViewDialogOpen,
  editSheetOpen,
  setEditSheetOpen,
  selectedEstimateId,
  onEstimateCreatedOrUpdated,
  onEditEstimate
}: EstimateDialogsProps) {
  return (
    <>
      <NewEstimateSheet 
        open={newEstimateOpen} 
        onOpenChange={setNewEstimateOpen}
        onEstimateCreated={onEstimateCreatedOrUpdated}
      />

      <ViewEstimateDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        estimateId={selectedEstimateId}
        onEdit={onEditEstimate}
      />

      <EditEstimateSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        estimateId={selectedEstimateId}
        onEstimateUpdated={onEstimateCreatedOrUpdated}
      />
    </>
  );
}
