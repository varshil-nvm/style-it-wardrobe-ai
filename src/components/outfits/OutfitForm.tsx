
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { OutfitItem } from "@/types/wardrobe";
import OutfitItemSelector from "./OutfitItemSelector";
import OutfitSummary from "./OutfitSummary";

interface OutfitFormProps {
  currentOutfit: OutfitItem;
  outfitDate: Date | undefined;
  wardrobeItems: any[];
  onOutfitNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOutfitNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDateChange: (date: Date | undefined) => void;
  onRemoveItemFromOutfit: (itemId: string) => void;
  onAddItemToOutfit: (item: any) => void;
  onSaveOutfit: () => void;
}

const OutfitForm = ({
  currentOutfit,
  outfitDate,
  wardrobeItems,
  onOutfitNameChange,
  onOutfitNotesChange,
  onDateChange,
  onRemoveItemFromOutfit,
  onAddItemToOutfit,
  onSaveOutfit,
}: OutfitFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="outfit-name">Outfit Name</Label>
            <Input
              id="outfit-name"
              value={currentOutfit.name}
              onChange={onOutfitNameChange}
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
                    onDateChange(date);
                    setIsDialogOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
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
            onChange={onOutfitNotesChange}
            placeholder="Add notes about this outfit..."
            className="w-full h-24 px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-styleit-300"
          ></textarea>
        </div>
        
        <OutfitItemSelector
          currentOutfit={currentOutfit}
          wardrobeItems={wardrobeItems}
          onAddItemToOutfit={onAddItemToOutfit}
          onRemoveItemFromOutfit={onRemoveItemFromOutfit}
        />
      </div>
      
      <div className="col-span-1 space-y-4">
        <OutfitSummary 
          currentOutfit={currentOutfit}
          outfitDate={outfitDate}
          onSaveOutfit={onSaveOutfit}
        />
      </div>
    </div>
  );
};

export default OutfitForm;
