
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Estimate } from "@/models/Estimate";
import { EstimatesHeader } from "@/components/Estimates/EstimatesHeader";
import { EstimateTabs } from "@/components/Estimates/EstimateTabs";
import { EstimateDialogs } from "@/components/Estimates/EstimateDialogs";
import { useEstimatesData } from "@/hooks/useEstimatesData";

export default function Estimates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [newEstimateOpen, setNewEstimateOpen] = useState(false);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | undefined>(undefined);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Define query parameters based on active tab and search query
  const queryOptions = {
    page: currentPage,
    limit: 10,
    searchQuery: searchQuery !== "" ? searchQuery : undefined,
    status: activeTab !== "pending" ? activeTab : undefined
  };
  
  // Use custom hook to fetch and cache estimates
  const { data, isLoading, refetch } = useEstimatesData(queryOptions);
  
  const estimates = data?.data || [];
  const totalEstimates = data?.total || 0;
  
  useEffect(() => {
    if (location.pathname === "/estimates/new") {
      setNewEstimateOpen(true);
    }
  }, [location.pathname]);
  
  const handleNewEstimateOpenChange = (open: boolean) => {
    setNewEstimateOpen(open);
    if (!open && location.pathname === "/estimates/new") {
      navigate("/estimates");
    }
  };
  
  const handleNewEstimateClick = () => {
    navigate("/estimates/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleOpenEstimate = (estimate: Estimate) => {
    setSelectedEstimateId(estimate.id);
    setViewDialogOpen(true);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setSelectedEstimateId(estimate.id);
    setEditSheetOpen(true);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset page when changing tabs
  };

  return (
    <Layout title="Estimates" className="px-0 sm:px-6">
      <EstimatesHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onNewEstimateClick={handleNewEstimateClick}
      />

      <EstimateTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        estimates={estimates}
        isLoading={isLoading}
        onNewEstimateClick={handleNewEstimateClick}
        onOpenEstimate={handleOpenEstimate}
        onEditEstimate={handleEditEstimate}
        totalEstimates={totalEstimates}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <EstimateDialogs
        newEstimateOpen={newEstimateOpen}
        setNewEstimateOpen={handleNewEstimateOpenChange}
        viewDialogOpen={viewDialogOpen}
        setViewDialogOpen={setViewDialogOpen}
        editSheetOpen={editSheetOpen}
        setEditSheetOpen={setEditSheetOpen}
        selectedEstimateId={selectedEstimateId}
        onEstimateCreatedOrUpdated={refetch}
        onEditEstimate={handleEditEstimate}
      />
    </Layout>
  );
}
