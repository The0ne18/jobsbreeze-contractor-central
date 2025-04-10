
import { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import ClientList from "@/components/Clients/ClientList";
import ClientForm from "@/components/Clients/ClientForm";
import { Client, NewClient } from "@/models/Client";
import { getClients, createClient, updateClient, deleteClient } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Failed to load clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentClient(undefined);
    setFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setCurrentClient(client);
    setFormOpen(true);
  };

  const handleSave = async (clientData: NewClient) => {
    try {
      if (currentClient) {
        // Update existing client
        const updated = await updateClient(currentClient.id, clientData);
        if (updated) {
          setClients(clients.map(c => c.id === currentClient.id ? updated : c));
          toast.success("Client updated successfully");
        }
      } else {
        // Create new client
        const newClient = await createClient(clientData);
        setClients([newClient, ...clients]);
        toast.success("Client created successfully");
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Failed to save client");
    }
  };

  const confirmDelete = (id: string) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      const success = await deleteClient(clientToDelete);
      if (success) {
        setClients(clients.filter(c => c.id !== clientToDelete));
        toast.success("Client deleted successfully");
      } else {
        toast.error("Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Clients">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="search"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
          </div>
          <Button onClick={handleAddNew} className="whitespace-nowrap">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        ) : (
          <ClientList 
            clients={filteredClients} 
            onEdit={handleEdit} 
            onDelete={confirmDelete} 
          />
        )}
      </div>

      <ClientForm 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        client={currentClient}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this client and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
