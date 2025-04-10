
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FilePlus, Search, Download, FileText, PenLine } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import NewEstimateSheet from "@/components/Estimates/NewEstimateSheet";
import { Estimate } from "@/models/Estimate";
import { getEstimates } from "@/services/estimateService";

export default function Estimates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEstimateOpen, setNewEstimateOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Load estimates data
  useEffect(() => {
    fetchEstimates();
  }, []);
  
  // Check if we should open the new estimate form
  useEffect(() => {
    if (location.pathname === "/estimates/new") {
      setNewEstimateOpen(true);
    }
  }, [location.pathname]);
  
  const fetchEstimates = async () => {
    setIsLoading(true);
    try {
      const data = await getEstimates();
      setEstimates(data);
    } catch (error) {
      console.error("Failed to fetch estimates:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter estimates based on active tab and search query
  const filteredEstimates = estimates.filter(estimate => {
    const matchesTab = 
      (activeTab === "pending" && estimate.status !== "approved" && estimate.status !== "declined") ||
      estimate.status === activeTab;
    
    const matchesSearch = 
      searchQuery === "" || 
      estimate.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Handle new estimate sheet open/close
  const handleNewEstimateOpenChange = (open: boolean) => {
    setNewEstimateOpen(open);
    if (!open && location.pathname === "/estimates/new") {
      navigate("/estimates");
    }
  };
  
  // Handle "New Estimate" button click
  const handleNewEstimateClick = () => {
    navigate("/estimates/new");
  };

  return (
    <Layout title="Estimates" className="px-0 sm:px-6">
      {/* Header with search and actions */}
      <div className="mb-6 px-4 sm:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search all estimates by Name, Address, Estimate # or PO #"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Use Template</span>
              <Badge variant="outline" className="ml-1 rounded-sm bg-primary/20 px-1 text-xs font-semibold uppercase text-primary">
                PRO
              </Badge>
            </Button>
            <Button className="gap-2" onClick={handleNewEstimateClick}>
              <FilePlus className="h-4 w-4" />
              New Estimate
            </Button>
          </div>
        </div>
      </div>

      {/* Status tabs */}
      <Tabs 
        defaultValue="pending" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="pending" 
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              activeTab === "pending" ? "font-semibold text-primary" : "text-muted-foreground"
            )}
          >
            PENDING
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              activeTab === "approved" ? "font-semibold text-primary" : "text-muted-foreground"
            )}
          >
            APPROVED
          </TabsTrigger>
          <TabsTrigger 
            value="declined" 
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              activeTab === "declined" ? "font-semibold text-primary" : "text-muted-foreground"
            )}
          >
            DECLINED
          </TabsTrigger>
        </TabsList>

        {/* Tab content for all statuses */}
        <TabsContent value="pending" className="mt-0 rounded-none border-none p-0">
          {renderEstimatesList(filteredEstimates, isLoading, handleNewEstimateClick)}
        </TabsContent>
        <TabsContent value="approved" className="mt-0 rounded-none border-none p-0">
          {renderEstimatesList(filteredEstimates, isLoading, handleNewEstimateClick)}
        </TabsContent>
        <TabsContent value="declined" className="mt-0 rounded-none border-none p-0">
          {renderEstimatesList(filteredEstimates, isLoading, handleNewEstimateClick)}
        </TabsContent>
      </Tabs>

      {/* New Estimate Sheet */}
      <NewEstimateSheet 
        open={newEstimateOpen} 
        onOpenChange={handleNewEstimateOpenChange}
        onEstimateCreated={fetchEstimates}
      />
    </Layout>
  );
}

// Helper function to render the estimates list
function renderEstimatesList(estimates: Estimate[], isLoading: boolean, onNewEstimateClick: () => void) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">Loading estimates...</div>
      </div>
    );
  }

  if (estimates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6">
          <img 
            src="/placeholder.svg" 
            alt="No Estimates" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">No Estimates Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create your first estimate to start tracking your business proposals and convert them to invoices.
          </p>
        </div>
        <Button className="mt-4" onClick={onNewEstimateClick}>
          <FilePlus className="mr-2 h-4 w-4" />
          Create New Estimate
        </Button>
      </div>
    );
  }

  // Group estimates by month
  const estimatesByMonth: Record<string, Estimate[]> = {};
  estimates.forEach(estimate => {
    const monthYear = format(new Date(estimate.date), "MMMM yyyy");
    if (!estimatesByMonth[monthYear]) {
      estimatesByMonth[monthYear] = [];
    }
    estimatesByMonth[monthYear].push(estimate);
  });

  return (
    <div className="divide-y">
      {Object.entries(estimatesByMonth).map(([monthYear, monthEstimates]) => (
        <div key={monthYear} className="py-4">
          <div className="flex justify-between items-center px-4 py-2">
            <h3 className="text-lg font-medium">{monthYear}</h3>
            <div className="text-right">
              <span className="font-semibold">Total: ${monthEstimates.reduce((sum, est) => sum + est.total, 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-1 mt-2">
            {monthEstimates.map(estimate => (
              <div key={estimate.id} className="border-t py-4 px-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{estimate.id}</span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-600 font-medium uppercase text-xs">
                        {estimate.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(estimate.date), "MMMM do yyyy")}
                    </div>
                    <div className="text-sm font-medium mt-1">
                      {estimate.clientName}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 md:flex-row">
                    <div className="text-right font-medium mr-4">
                      ${estimate.total.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">
                        Open
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <PenLine className="h-4 w-4" />
                        <span className="ml-1">Edit</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
