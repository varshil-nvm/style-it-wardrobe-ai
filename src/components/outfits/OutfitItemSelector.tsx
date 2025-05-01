
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ClothingItem, OutfitItem } from "@/types/wardrobe";

interface OutfitItemSelectorProps {
  currentOutfit: OutfitItem;
  wardrobeItems: ClothingItem[];
  onAddItemToOutfit: (item: ClothingItem) => void;
  onRemoveItemFromOutfit: (itemId: string) => void;
}

const categoryOrder = ["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"];
const defaultImageUrl = "https://images.unsplash.com/photo-1582562124811-c09040d0a901";

const OutfitItemSelector = ({
  currentOutfit,
  wardrobeItems,
  onAddItemToOutfit,
  onRemoveItemFromOutfit,
}: OutfitItemSelectorProps) => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("tops");

  const availableItemsForCategory = wardrobeItems.filter(
    (item) => item.category === selectedCategoryTab && !item.isDirty
  );

  return (
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
                      onClick={() => onRemoveItemFromOutfit(item.id)}
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
                              onClick={() => onAddItemToOutfit(item)}
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
  );
};

export default OutfitItemSelector;
