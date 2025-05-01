
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { Calendar as CalendarIcon, Plus, Save, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  date?: Date;
  notes?: string;
  favorite: boolean;
}

const defaultImageUrl = "https://images.unsplash.com/photo-1582562124811-c09040d0a901";

const categoryOrder = ["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"];

const Outfits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>({
    id: crypto.randomUUID(),
    name: "",
    items: [],
    favorite: false,
  });
  const [outfitDate, setOutfitDate] = useState<Date | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState("create");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("tops");
  
  useEffect(() => {
    if (!user) return;
    
    const storedItems = localStorage.getItem(`wardrobe_${user.id}`);
    if (storedItems) {
      setWardrobeItems(JSON.parse(storedItems));
    }
    
    const storedOutfits = localStorage.getItem(`outfits_${user.id}`);
    if (storedOutfits) {
      setOutfits(JSON.parse(storedOutfits));
    }
  }, [user]);
  
  const saveOutfitsToStorage = (outfitsToSave: Outfit[]) => {
    if (!user) return;
    localStorage.setItem(`outfits_${user.id}`, JSON.stringify(outfitsToSave));
  };
  
  const updateWardrobeItems = (updatedItems: ClothingItem[]) => {
    if (!user) return;
    setWardrobeItems(updatedItems);
    localStorage.setItem(`wardrobe_${user.id}`, JSON.stringify(updatedItems));
  };
  
  const handleOutfitNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentOutfit((prev) => ({ ...prev, name: e.target.value }));
  };
  
  const handleOutfitNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentOutfit((prev) => ({ ...prev, notes: e.target.value }));
  };
  
  const handleAddItemToOutfit = (item: ClothingItem) => {
    // Check if this category already has an item (for tops/bottoms/dresses)
    const hasItemInCategory = 
      (item.category === "tops" || item.category === "bottoms" || item.category === "dresses") &&
      currentOutfit.items.some((i) => i.category === item.category);
      
    if (hasItemInCategory && item.category === "dresses") {
      // Remove tops and bottoms when adding a dress
      setCurrentOutfit((prev) => ({
        ...prev,
        items: [
          ...prev.items.filter(
            (i) => i.category !== "tops" && i.category !== "bottoms" && i.category !== "dresses"
          ),
          item,
        ],
      }));
    } else if (hasItemInCategory && (item.category === "tops" || item.category === "bottoms")) {
      // Remove dresses when adding tops or bottoms
      const otherCategory = item.category === "tops" ? "bottoms" : "tops";
      const hasOtherCategory = currentOutfit.items.some((i) => i.category === otherCategory);
      
      if (!hasOtherCategory && currentOutfit.items.some((i) => i.category === "dresses")) {
        // Remove the dress if adding top without bottom or vice versa
        setCurrentOutfit((prev) => ({
          ...prev,
          items: [
            ...prev.items.filter((i) => i.category !== "dresses" && i.category !== item.category),
            item,
          ],
        }));
      } else {
        // Just replace the item in the same category
        setCurrentOutfit((prev) => ({
          ...prev,
          items: [
            ...prev.items.filter((i) => i.category !== item.category),
            item,
          ],
        }));
      }
    } else {
      // For other categories, just add the item if not already present
      if (!currentOutfit.items.some((i) => i.id === item.id)) {
        setCurrentOutfit((prev) => ({
          ...prev,
          items: [...prev.items, item],
        }));
      }
    }
    
    setIsDialogOpen(false);
  };
  
  const handleRemoveItemFromOutfit = (itemId: string) => {
    setCurrentOutfit((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };
  
  const handleSaveOutfit = () => {
    if (!currentOutfit.name) {
      toast({
        title: "Error",
        description: "Please give your outfit a name.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentOutfit.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to your outfit.",
        variant: "destructive",
      });
      return;
    }
    
    const outfitToSave = {
      ...currentOutfit,
      date: outfitDate,
    };
    
    // Increment timesWorn for each item if scheduling for today or past
    let updatedWardrobeItems = [...wardrobeItems];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (outfitDate && outfitDate <= today) {
      updatedWardrobeItems = wardrobeItems.map(item => {
        if (currentOutfit.items.some(outfitItem => outfitItem.id === item.id)) {
          return {
            ...item,
            timesWorn: (item.timesWorn || 0) + 1,
            isDirty: true,
          };
        }
        return item;
      });
      
      updateWardrobeItems(updatedWardrobeItems);
    }
    
    const updatedOutfits = outfits.some((outfit) => outfit.id === currentOutfit.id)
      ? outfits.map((outfit) =>
          outfit.id === currentOutfit.id ? outfitToSave : outfit
        )
      : [...outfits, outfitToSave];
    
    setOutfits(updatedOutfits);
    saveOutfitsToStorage(updatedOutfits);
    
    toast({
      title: "Outfit saved",
      description: outfitDate
        ? `"${currentOutfit.name}" scheduled for ${format(outfitDate, 'MMMM d, yyyy')}`
        : `"${currentOutfit.name}" has been saved to your outfits.`,
    });
    
    // Reset the current outfit
    setCurrentOutfit({
      id: crypto.randomUUID(),
      name: "",
      items: [],
      favorite: false,
    });
    setOutfitDate(undefined);
    setSelectedTab("saved");
  };
  
  const handleDeleteOutfit = (id: string) => {
    const outfitToDelete = outfits.find((outfit) => outfit.id === id);
    if (!outfitToDelete) return;
    
    const updatedOutfits = outfits.filter((outfit) => outfit.id !== id);
    setOutfits(updatedOutfits);
    saveOutfitsToStorage(updatedOutfits);
    
    toast({
      title: "Outfit deleted",
      description: `"${outfitToDelete.name}" has been deleted.`,
    });
  };
  
  const handleEditOutfit = (outfit: Outfit) => {
    setCurrentOutfit(outfit);
    setOutfitDate(outfit.date);
    setSelectedTab("create");
  };
  
  const handleToggleFavorite = (outfitId: string) => {
    const updatedOutfits = outfits.map((outfit) =>
      outfit.id === outfitId
        ? { ...outfit, favorite: !outfit.favorite }
        : outfit
    );
    
    setOutfits(updatedOutfits);
    saveOutfitsToStorage(updatedOutfits);
    
    const outfit = updatedOutfits.find((o) => o.id === outfitId);
    
    toast({
      title: outfit?.favorite ? "Added to favorites" : "Removed from favorites",
      description: `"${outfit?.name}" has been ${
        outfit?.favorite ? "added to" : "removed from"
      } your favorites.`,
    });
  };
  
  const availableItemsForCategory = wardrobeItems.filter(
    (item) => item.category === selectedCategoryTab && !item.isDirty
  );

  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Outfits</h1>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="create">Create Outfit</TabsTrigger>
              <TabsTrigger value="saved">Saved Outfits</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="outfit-name">Outfit Name</Label>
                      <Input
                        id="outfit-name"
                        value={currentOutfit.name}
                        onChange={handleOutfitNameChange}
                        placeholder="Summer Weekend"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Schedule Date (Optional)</Label>
                      <div className="flex mt-1">
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !outfitDate && "text-muted-foreground"
                          )}
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {outfitDate ? format(outfitDate, "PPP") : "Pick a date"}
                        </Button>
                      </div>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="p-0">
                          <Calendar
                            mode="single"
                            selected={outfitDate}
                            onSelect={(date) => {
                              setOutfitDate(date);
                              setIsDialogOpen(false);
                            }}
                            initialFocus
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="outfit-notes">Notes (Optional)</Label>
                    <textarea
                      id="outfit-notes"
                      value={currentOutfit.notes || ""}
                      onChange={handleOutfitNotesChange}
                      placeholder="Add notes about this outfit..."
                      className="w-full h-24 px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-styleit-300"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {categoryOrder.map((category) => {
                      const item = currentOutfit.items.find(
                        (item) => item.category === category
                      );
                      
                      return (
                        <div
                          key={category}
                          className={cn(
                            "outfit-item",
                            item && "outfit-item-filled"
                          )}
                        >
                          {item ? (
                            <div className="relative w-full h-full">
                              <img
                                src={item.imageUrl || defaultImageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover object-center"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex flex-col justify-between p-2">
                                <div className="flex justify-end">
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-6 w-6 opacity-0 hover:opacity-100 focus:opacity-100"
                                    onClick={() => handleRemoveItemFromOutfit(item.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="bg-white bg-opacity-75 p-1 text-xs">
                                  {item.name}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" className="text-muted-foreground">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add {category}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Select {category}</DialogTitle>
                                  <DialogDescription>
                                    Choose an item to add to your outfit.
                                  </DialogDescription>
                                </DialogHeader>
                                <Tabs
                                  value={selectedCategoryTab}
                                  onValueChange={setSelectedCategoryTab}
                                >
                                  <TabsList className="grid grid-cols-3">
                                    <TabsTrigger value="tops">Tops</TabsTrigger>
                                    <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                                    <TabsTrigger value={category}>{category}</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value={selectedCategoryTab} className="mt-4">
                                    {availableItemsForCategory.length === 0 ? (
                                      <div className="text-center py-6">
                                        <p className="text-muted-foreground">
                                          No clean items found in this category.
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                                        {availableItemsForCategory.map((item) => (
                                          <div
                                            key={item.id}
                                            className="cursor-pointer clothing-card"
                                            onClick={() => handleAddItemToOutfit(item)}
                                          >
                                            <img
                                              src={item.imageUrl || defaultImageUrl}
                                              alt={item.name}
                                              className="w-full aspect-square object-cover"
                                            />
                                            <div className="p-2">
                                              <p className="text-sm truncate">{item.name}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="col-span-1 space-y-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Outfit Summary</h3>
                    <div className="space-y-2">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {currentOutfit.name || "Unnamed outfit"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Items:</span>{" "}
                        {currentOutfit.items.length} selected
                      </p>
                      <p>
                        <span className="text-muted-foreground">Date:</span>{" "}
                        {outfitDate ? format(outfitDate, "MMMM d, yyyy") : "Not scheduled"}
                      </p>
                    </div>
                    
                    <Button
                      className="w-full mt-4 bg-styleit-400 hover:bg-styleit-500"
                      onClick={handleSaveOutfit}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Outfit
                    </Button>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Items</h3>
                    
                    {currentOutfit.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No items added yet. Click on the "Add" buttons to build your outfit.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {currentOutfit.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>{item.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground"
                              onClick={() => handleRemoveItemFromOutfit(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="animate-fade-in">
              {outfits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No outfits saved yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create your first outfit to see it here.
                    </p>
                    
                    <Button
                      onClick={() => setSelectedTab("create")}
                      variant="outline"
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Outfit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {outfits.map((outfit) => (
                    <div key={outfit.id} className="bg-white border rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium">{outfit.name}</h3>
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={() => handleToggleFavorite(outfit.id)}
                            >
                              {outfit.favorite ? "★" : "☆"}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={() => handleEditOutfit(outfit)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={() => handleDeleteOutfit(outfit.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {outfit.date && (
                          <Badge variant="outline" className="mt-1">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {format(new Date(outfit.date), "MMMM d, yyyy")}
                          </Badge>
                        )}
                        
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {outfit.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="aspect-square rounded overflow-hidden">
                              <img
                                src={item.imageUrl || defaultImageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {outfit.items.length > 3 && (
                            <div className="aspect-square rounded bg-gray-100 flex items-center justify-center text-sm text-muted-foreground">
                              +{outfit.items.length - 3} more
                            </div>
                          )}
                        </div>
                        
                        {outfit.notes && (
                          <div className="mt-3 text-sm text-muted-foreground">
                            <p className="line-clamp-2">{outfit.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="animate-fade-in">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-medium mb-4">Outfit Calendar</h3>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      className="rounded-md border"
                      modifiers={{
                        hasOutfit: outfits.filter(o => o.date).map(o => new Date(o.date!)),
                      }}
                      modifiersStyles={{
                        hasOutfit: {
                          backgroundColor: "rgb(219, 208, 255)",
                          color: "rgb(75, 52, 122)",
                        },
                      }}
                    />
                  </div>
                  
                  <div className="md:w-1/2">
                    <h4 className="font-medium mb-3">Scheduled Outfits</h4>
                    
                    {outfits.filter(o => o.date).length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No scheduled outfits. Create an outfit and assign a date to see it here.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {outfits
                          .filter(o => o.date)
                          .sort((a, b) => 
                            new Date(a.date!).getTime() - new Date(b.date!).getTime()
                          )
                          .map((outfit) => (
                            <div
                              key={outfit.id}
                              className="flex items-center space-x-3 p-2 border rounded-md"
                            >
                              <div className="w-12 h-12 rounded overflow-hidden">
                                <img
                                  src={outfit.items[0]?.imageUrl || defaultImageUrl}
                                  alt={outfit.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium">{outfit.name}</h5>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(outfit.date!), "MMMM d, yyyy")}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditOutfit(outfit)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Outfits;
