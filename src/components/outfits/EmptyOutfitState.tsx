
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyOutfitStateProps {
  onCreateOutfit: () => void;
}

const EmptyOutfitState = ({ onCreateOutfit }: EmptyOutfitStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h3 className="text-lg font-medium">No outfits saved yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first outfit to see it here.
        </p>
        
        <Button
          onClick={onCreateOutfit}
          variant="outline"
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Outfit
        </Button>
      </div>
    </div>
  );
};

export default EmptyOutfitState;
