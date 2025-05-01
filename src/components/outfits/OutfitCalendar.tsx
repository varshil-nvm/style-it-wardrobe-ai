
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { OutfitItem } from "@/types/wardrobe";

interface OutfitCalendarProps {
  outfits: OutfitItem[];
  onEditOutfit: (outfit: OutfitItem) => void;
}

const defaultImageUrl = "https://images.unsplash.com/photo-1582562124811-c09040d0a901";

const OutfitCalendar = ({ outfits, onEditOutfit }: OutfitCalendarProps) => {
  const scheduledOutfits = outfits.filter(o => o.date);
  
  return (
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
          
          {scheduledOutfits.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No scheduled outfits. Create an outfit and assign a date to see it here.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scheduledOutfits
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
                      onClick={() => onEditOutfit(outfit)}
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
  );
};

export default OutfitCalendar;
