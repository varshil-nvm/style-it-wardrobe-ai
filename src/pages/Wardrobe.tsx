
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  size: string;
  brand: string;
  tags: string[];
  imageUrl: string;
  timesWorn: number;
  lastWashed: string | null;
  isDirty: boolean;
}

const categories = [
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
];

const defaultImageUrl = "https://images.unsplash.com/photo-1582562124811-c09040d0a901";

const Wardrobe = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [newItem, setNewItem] = useState<Partial<ClothingItem>>({
    name: "",
    category: "",
    color: "",
    size: "",
    brand: "",
    tags: [],
    imageUrl: defaultImageUrl,
  });
  
  // Tag input state
  const [tagInput, setTagInput] = useState("");
  
  useEffect(() => {
    if (!user) return;
    
    const storedItems = localStorage.getItem(`wardrobe_${user.id}`);
    if (storedItems) {
      setClothingItems(JSON.parse(storedItems));
    }
  }, [user]);
  
  const saveItemsToStorage = (items: ClothingItem[]) => {
    if (!user) return;
    localStorage.setItem(`wardrobe_${user.id}`, JSON.stringify(items));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setNewItem((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()],
    }));
    setTagInput("");
  };
  
  const handleRemoveTag = (tag: string) => {
    setNewItem((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setNewItem((prev) => ({ ...prev, imageUrl }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.category) {
      toast({
        title: "Error",
        description: "Name and category are required.",
        variant: "destructive",
      });
      return;
    }
    
    const newItemWithId: ClothingItem = {
      ...newItem as ClothingItem,
      id: crypto.randomUUID(),
      timesWorn: 0,
      lastWashed: null,
      isDirty: false,
    };
    
    const updatedItems = [...clothingItems, newItemWithId];
    setClothingItems(updatedItems);
    saveItemsToStorage(updatedItems);
    
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your wardrobe.`,
    });
    
    setNewItem({
      name: "",
      category: "",
      color: "",
      size: "",
      brand: "",
      tags: [],
      imageUrl: defaultImageUrl,
    });
    
    setIsDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    const itemToDelete = clothingItems.find((item) => item.id === id);
    if (!itemToDelete) return;
    
    const updatedItems = clothingItems.filter((item) => item.id !== id);
    setClothingItems(updatedItems);
    saveItemsToStorage(updatedItems);
    
    toast({
      title: "Item removed",
      description: `${itemToDelete.name} has been removed from your wardrobe.`,
    });
  };
  
  const handleMarkDirty = (id: string, isDirty: boolean) => {
    const updatedItems = clothingItems.map((item) =>
      item.id === id ? { ...item, isDirty } : item
    );
    setClothingItems(updatedItems);
    saveItemsToStorage(updatedItems);
    
    const item = clothingItems.find((item) => item.id === id);
    
    toast({
      title: isDirty ? "Marked as dirty" : "Marked as clean",
      description: `${item?.name} has been marked as ${isDirty ? "dirty" : "clean"}.`,
    });
  };
  
  const filteredItems = clothingItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold">My Wardrobe</h1>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-styleit-400 hover:bg-styleit-500 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Clothing Item</DialogTitle>
                    <DialogDescription>
                      Add details about your clothing item to your wardrobe.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newItem.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          name="color"
                          value={newItem.color || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="size">Size</Label>
                        <Input
                          id="size"
                          name="size"
                          value={newItem.size || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          name="brand"
                          value={newItem.brand || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="tagInput"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddTag}
                        >
                          Add
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newItem.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-xs rounded-full hover:bg-gray-200 h-4 w-4 inline-flex items-center justify-center"
                            >
                              &times;
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageUpload">Image</Label>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      
                      {newItem.imageUrl && (
                        <div className="mt-2 relative aspect-square w-32 rounded-md overflow-hidden">
                          <img
                            src={newItem.imageUrl}
                            alt="Item preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-styleit-400 hover:bg-styleit-500">
                        Add Item
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-6 overflow-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory} className="mt-0">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No items found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm
                        ? "Try a different search term or clear the filters."
                        : "Add some items to your wardrobe to get started."}
                    </p>
                    
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="clothing-card group">
                      <div className="relative">
                        <img
                          src={item.imageUrl || defaultImageUrl}
                          alt={item.name}
                          className="clothing-image"
                        />
                        
                        {item.isDirty && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Dirty
                          </Badge>
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={() => handleMarkDirty(item.id, !item.isDirty)}
                            >
                              {item.isDirty ? "Clean" : "Dirty"}
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3">
                        <h3 className="font-medium line-clamp-1">{item.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground">
                            {item.brand || "No brand"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item.size || "N/A"}
                          </span>
                        </div>
                        
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Wardrobe;
