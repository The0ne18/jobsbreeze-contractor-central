
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout/Layout";
import { Item } from "@/models/Item";
import { ItemsHeader } from "@/components/Items/ItemsHeader";
import { ItemList } from "@/components/Items/ItemList";
import { useItemsData } from "@/hooks/useItemsData";
import NewItemSheet from "@/components/Items/NewItemSheet";
import EditItemSheet from "@/components/Items/EditItemSheet";
import { deleteItem } from "@/services/itemService";

export default function Items() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Use custom hook to fetch and cache items
  const { data: items = [], isLoading, refetch } = useItemsData();
  
  useEffect(() => {
    if (location.pathname === "/items/new") {
      setNewItemOpen(true);
    }
  }, [location.pathname]);
  
  useEffect(() => {
    // Filter items based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          (item.description && item.description.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery]);
  
  const handleNewItemOpenChange = (open: boolean) => {
    setNewItemOpen(open);
    if (!open && location.pathname === "/items/new") {
      navigate("/items");
    }
  };
  
  const handleNewItemClick = () => {
    navigate("/items/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItemId(item.id);
    setEditSheetOpen(true);
  };

  return (
    <Layout title="Items" className="px-0 sm:px-6">
      <ItemsHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onNewItemClick={handleNewItemClick}
      />

      <ItemList 
        items={filteredItems}
        isLoading={isLoading}
        onEditItem={handleEditItem}
        onNewItemClick={handleNewItemClick}
      />

      {/* Item Sheets */}
      <NewItemSheet
        open={newItemOpen}
        onOpenChange={handleNewItemOpenChange}
        onItemCreated={refetch}
      />

      <EditItemSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        itemId={selectedItemId}
        onItemUpdated={refetch}
      />
    </Layout>
  );
}
