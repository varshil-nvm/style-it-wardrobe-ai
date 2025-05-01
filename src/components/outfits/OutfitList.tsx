
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OutfitItem, ClothingItem } from "@/types/wardrobe";

interface OutfitListProps {
  outfits: OutfitItem[];
  onDeleteOutfit: (id: string) => void;
  onEditOutfit: (outfit: OutfitItem) => void;
  onToggleFavorite: (outfitId: string) => void;
}

const defaultImageUrl = "https://images.unsplash.com/photo-1582562124811-c09040d0a901";

const OutfitList = ({
  outfits,
  onDeleteOutfit,
  onEditOutfit,
  onToggleFavorite,
}: OutfitListProps) => {
  return (
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
                  onClick={() => onToggleFavorite(outfit.id)}
                >
                  {outfit.favorite ? "★" : "☆"}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => onEditOutfit(outfit)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => onDeleteOutfit(outfit.id)}
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
  );
};

export default OutfitList;
