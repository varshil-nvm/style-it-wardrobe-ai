
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { Calendar as CalendarIcon, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

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

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favoriteOutfits, setFavoriteOutfits] = useState<Outfit[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const storedOutfits = localStorage.getItem(`outfits_${user.id}`);
    if (storedOutfits) {
      const outfits = JSON.parse(storedOutfits);
      const favorites = outfits.filter((outfit: Outfit) => outfit.favorite);
      setFavoriteOutfits(favorites);
    }
  }, [user]);
  
  const handleRemoveFavorite = (outfitId: string) => {
    if (!user) return;
    
    // Remove from favorites
    const outfit = favoriteOutfits.find(o => o.id === outfitId);
    
    // Update local state
    const updatedFavorites = favoriteOutfits.filter(o => o.id !== outfitId);
    setFavoriteOutfits(updatedFavorites);
    
    // Get all outfits and update the favorite status
    const storedOutfits = localStorage.getItem(`outfits_${user.id}`);
    if (storedOutfits) {
      const allOutfits = JSON.parse(storedOutfits);
      const updatedOutfits = allOutfits.map((o: Outfit) => 
        o.id === outfitId ? { ...o, favorite: false } : o
      );
      
      // Save back to storage
      localStorage.setItem(`outfits_${user.id}`, JSON.stringify(updatedOutfits));
    }
    
    toast({
      title: "Removed from favorites",
      description: `"${outfit?.name}" has been removed from your favorites.`,
    });
  };
  
  return (
    <AuthGuard>
      <MainLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Favorite Outfits</h1>
          
          {favoriteOutfits.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center pt-10 pb-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No favorite outfits yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Mark outfits as favorites to see them here for quick access.
                  </p>
                  
                  <Button asChild className="bg-styleit-400 hover:bg-styleit-500">
                    <Link to="/outfits">
                      View All Outfits
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteOutfits.map((outfit) => (
                <Card key={outfit.id} className="group">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {outfit.name}
                      {outfit.date && (
                        <Badge variant="outline" className="ml-2">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {format(new Date(outfit.date), "MMM d")}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {outfit.items.slice(0, 6).map((item) => (
                        <div key={item.id} className="aspect-square rounded overflow-hidden">
                          <img
                            src={item.imageUrl || defaultImageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {outfit.items.length > 6 && (
                        <div className="aspect-square rounded bg-gray-100 flex items-center justify-center text-sm text-muted-foreground">
                          +{outfit.items.length - 6} more
                        </div>
                      )}
                    </div>
                    
                    {outfit.notes && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p className="line-clamp-2">{outfit.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-full flex space-x-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/outfits`} state={{ editOutfit: outfit }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRemoveFavorite(outfit.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default Favorites;
