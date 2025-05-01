
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { OutfitItem } from "@/types/wardrobe";

interface OutfitSummaryProps {
  currentOutfit: OutfitItem;
  outfitDate: Date | undefined;
  onSaveOutfit: () => void;
}

const OutfitSummary = ({
  currentOutfit,
  outfitDate,
  onSaveOutfit,
}: OutfitSummaryProps) => {
  return (
    <>
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
          onClick={onSaveOutfit}
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
                  onClick={() => {/* This will be handled by the parent component */}}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default OutfitSummary;
