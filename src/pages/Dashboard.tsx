import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Receipt, UserPlus, Users, FileCheck, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { getClients } from "@/services/clientService";
import { Client } from "@/models/Client";

export default function Dashboard() {
  const [clientCount, setClientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await getClients();
        setClientCount(clients.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data for demonstration
  const summaryData = {
    openEstimates: 5,
    pendingInvoices: 3,
    overdueInvoices: 1,
    totalOutstanding: 4250.75
  };

  return (
    <Layout>
      <div className="grid gap-6">
        <div>
          <h1 className="font-bold text-3xl">Welcome to JobsBreeze</h1>
          <p className="text-muted-foreground">Your business management dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.openEstimates}</div>
                <FileCheck className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.pendingInvoices}</div>
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.overdueInvoices}</div>
                <Receipt className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">${summaryData.totalOutstanding.toFixed(2)}</div>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 bg-jobs-green hover:bg-jobs-green-hover" size="lg">
              <Link to="/estimates/new" className="flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 mb-2" />
                <span>Create Estimate</span>
              </Link>
            </Button>
            
            <Button asChild className="h-auto p-4 bg-jobs-blue hover:bg-jobs-blue-hover" size="lg">
              <Link to="/invoices/new" className="flex flex-col items-center justify-center">
                <Receipt className="h-8 w-8 mb-2" />
                <span>New Invoice</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 border-2" size="lg">
              <Link to="/clients/new" className="flex flex-col items-center justify-center">
                <UserPlus className="h-8 w-8 mb-2" />
                <span>Add Client</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Your most recently added clients</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
                </div>
              ) : clientCount > 0 ? (
                <div className="space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/clients">
                      <Users className="mr-2 h-4 w-4" />
                      View All {clientCount} Clients
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">No clients added yet</p>
                  <Button asChild size="sm">
                    <Link to="/clients">Add Your First Client</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest business actions</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground mb-2">Start creating estimates and invoices</p>
              <p className="text-muted-foreground mb-4">Your recent activity will appear here</p>
              <div className="flex justify-center space-x-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/estimates/new">Create Estimate</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/invoices/new">Create Invoice</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
