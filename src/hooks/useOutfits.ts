
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { OutfitItem, ClothingItem } from '@/types/wardrobe';

export const useOutfits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitItem>({
    id: crypto.randomUUID(),
    name: "",
    items: [],
    favorite: false,
  });
  const [outfitDate, setOutfitDate] = useState<Date | undefined>(undefined);

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
  
  const saveOutfitsToStorage = (outfitsToSave: OutfitItem[]) => {
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
  
  const handleEditOutfit = (outfit: OutfitItem) => {
    setCurrentOutfit(outfit);
    setOutfitDate(outfit.date);
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

  return {
    wardrobeItems,
    outfits,
    currentOutfit,
    outfitDate,
    handleOutfitNameChange,
    handleOutfitNotesChange,
    handleAddItemToOutfit,
    handleRemoveItemFromOutfit,
    handleSaveOutfit,
    handleDeleteOutfit,
    handleEditOutfit,
    handleToggleFavorite,
    setOutfitDate,
  };
};
